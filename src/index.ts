import { Hono } from "hono";
import { cors } from "hono/cors";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { SYSTEM_PROMPT } from "./prompt";

type Bindings = {
  GENAI_KEY: string;
  LLM_BASE_URL?: string;
  LLM_MODEL_NAME?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 1. Configure CORS dynamically to allow your portfolio domain and local dev environment
app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow localhost for development and your official github pages portfolio URL
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "https://rathoreatri03.github.io"
      ) {
        return origin;
      }
      return "https://rathoreatri03.github.io"; // Default fallback
    },
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Content-Type"],
    maxAge: 86400,
    credentials: true,
  })
);

// 2. Health & Diagnostic Check
app.get("/api/health", (c) => {
  return c.json({
    status: "online",
    system: "DODO Core Agent",
    uptime: "24/7",
    compatibility: c.env.GENAI_KEY ? "verified" : "missing_key",
  });
});

// 3. Real-time LangChain Streaming Chat Endpoint
app.post("/api/chat", async (c) => {
  try {
    const { messages, model } = await c.req.json<{
      messages: { role: string; content: string }[];
      model?: string;
    }>();

    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: "Invalid parameters. 'messages' array is required." }, 400);
    }

    const apiKey = c.env.GENAI_KEY;
    if (!apiKey) {
      return c.json({ error: "System Configuration Error: Server API credentials are not initialized." }, 500);
    }

    // Determine custom server endpoints (e.g., Genesys AI or OpenRouter/vLLM/Gemini)
    // Default to OpenAI format compatible custom route, or custom provider
    const baseURL = c.env.LLM_BASE_URL || "https://your-domain.com/genAI/v1"; 
    const modelName = model || c.env.LLM_MODEL_NAME || "google/gemma-3-12b";

    // Initialize LangChain OpenAI model (which is universally compatible with OpenAI-like API servers)
    const chatModel = new ChatOpenAI({
      configuration: {
        baseURL: baseURL,
        defaultHeaders: {
          "GENAI_KEY": apiKey, // Use your custom GENAI_KEY header securely!
        }
      },
      modelName: modelName,
      streaming: true,
      temperature: 0.7,
    });

    // Format chat history into LangChain Message structures
    const langchainMessages = [
      new SystemMessage(SYSTEM_PROMPT)
    ];

    for (const msg of messages) {
      if (msg.role === "user") {
        langchainMessages.push(new HumanMessage(msg.content));
      } else if (msg.role === "assistant") {
        langchainMessages.push(new AIMessage(msg.content));
      }
    }

    // Set up standard Response streaming headers
    c.header("Content-Type", "text/event-stream");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");

    // Initiate stream
    const stream = await chatModel.stream(langchainMessages);

    // Stream the chunks using a readable stream
    const body = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const content = chunk.content;
            if (content) {
              // Wrap content in SSE (Server-Sent Events) formatting
              // Compatible with standard EventSource/fetch readers
              const ssePayload = {
                choices: [
                  {
                    delta: {
                      content: content,
                    },
                  },
                ],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(ssePayload)}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err: any) {
          const errorPayload = { error: err.message };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorPayload)}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(body);

  } catch (err: any) {
    return c.json({ error: err.message || "Unknown processing error occurred." }, 500);
  }
});

export default app;
