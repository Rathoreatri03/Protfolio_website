/**
 * Diagnostic Streaming Test Script (Modern Fetch Version)
 * Simulates a client call and prints the real-time token stream.
 *
 * ⚠️  IMPORTANT: This script ONLY works against the LOCAL wrangler dev server.
 *     It cannot call production because production requires a real browser-generated
 *     Turnstile token. The dummy token below only passes the LOCAL dummy secret key.
 *
 * HOW TO USE:
 *   1. Start local backend:  npm run dev  (in AI-Portfolio_backend folder)
 *   2. Run this script:      node test-stream.js
 */

// --- 🖥️ LOCAL DEV ENDPOINT (do NOT change to production URL) ---
const API_URL = "http://127.0.0.1:8787/api/chat";

const payload = {
  messages: [
    { role: "user", content: "Who is Atri Rathore and what does he generally do?" }
  ],
  model: "google/gemma-3-12b"
};

// Read TURNSTILE_TEST_TOKEN from .dev.vars (gitignored — never committed to GitHub)
import { readFileSync } from "fs";

const devVars = Object.fromEntries(
  readFileSync(new URL("./.dev.vars", import.meta.url), "utf-8")
    .split("\n")
    .filter(line => line.includes("=") && !line.startsWith("#"))
    .map(line => {
      const [key, ...rest] = line.split("=");
      // Strip surrounding quotes and any inline comments
      const value = rest.join("=").split(" #")[0].trim().replace(/^"|"$/g, "");
      return [key.trim(), value];
    })
);

const DUMMY_TEST_TOKEN = devVars.TURNSTILE_TEST_TOKEN;
if (!DUMMY_TEST_TOKEN) {
  console.error("[!] TURNSTILE_TEST_TOKEN not found in .dev.vars. Aborting.");
  process.exit(1);
}


async function startStreamTest() {
  console.log("--- Initializing Diagnostic Chat Stream Session ---");
  console.log(`Targeting Deployed Endpoint: ${API_URL}`);
  console.log("--------------------------------------------------");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cf-turnstile-response": DUMMY_TEST_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`\n[!] HTTP Error: Server responded with status ${response.status}`);
      console.error(`Payload details: ${errText}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      console.error("\n[!] Stream Error: Response body is not readable.");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the incoming packet and append it to our buffer
      buffer += decoder.decode(value, { stream: true });

      // Split the buffer by newlines to capture complete lines
      const lines = buffer.split('\n');

      // Keep the last incomplete fragment in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('data: ')) {
          const dataStr = trimmedLine.slice(6);
          if (dataStr === '[DONE]') {
            continue;
          }

          try {
            const data = JSON.parse(dataStr);
            if (data.error) {
              console.log(`\n[API Error Payload]: ${JSON.stringify(data.error)}`);
              continue;
            }
            const content = data.choices?.[0]?.delta?.content || "";
            process.stdout.write(content); // Print the token live!
            fullResponse += content;
          } catch (e) {
            // Ignore incomplete JSON parses
          }
        }
      }
    }

    // Process any remaining tail in the buffer
    const trimmedLine = buffer.trim();
    if (trimmedLine.startsWith('data: ')) {
      const dataStr = trimmedLine.slice(6);
      if (dataStr !== '[DONE]') {
        try {
          const data = JSON.parse(dataStr);
          const content = data.choices?.[0]?.delta?.content || "";
          process.stdout.write(content);
          fullResponse += content;
        } catch (e) {}
      }
    }

    console.log("\n--------------------------------------------------");
    console.log("Stream Complete.");

  } catch (err) {
    console.error(`\n[!] Uplink Error: Could not reach endpoint. ${err.message}`);
    console.log("Please ensure your computer is connected to the internet!");
  }
}

startStreamTest();
