/**
 * Diagnostic Streaming Test Script
 * Simulates a frontend call to the Hono/LangChain backend and prints the real-time token stream.
 * Run using: node test-stream.js
 */

const http = require('http');

const payload = JSON.stringify({
  messages: [
    { role: "user", content: "Who is Atri Rathore and what does he generally do?" }
  ],
  model: "google/gemma-3-12b"
});

const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log("--- Initializing Diagnostic Chat Stream Session ---");
console.log("Sending payload to http://localhost:8787/api/chat...");
console.log("--------------------------------------------------");

const req = http.request(options, (res) => {
  res.setEncoding('utf8');
  
  let fullResponse = "";
  let buffer = ""; // Keeps running TCP fragments

  res.on('data', (chunk) => {
    // Append incoming data packet to our running buffer
    buffer += chunk;

    // Split buffer by newlines to separate complete lines
    const lines = buffer.split('\n');

    // Keep the last incomplete fragment in the buffer for the next chunk
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
          process.stdout.write(content); // Print token in real-time!
          fullResponse += content;
        } catch (e) {
          // Ignore incomplete/malformed chunks
        }
      }
    }
  });

  res.on('end', () => {
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

    if (!fullResponse) {
      console.log("\n[!] Warning: Received empty response stream. Make sure your local wrangler dev server is running on port 8787 and your GENAI_KEY matches!");
    }
  });
});

req.on('error', (e) => {
  console.error(`\n[!] Connection Error: Could not reach backend server. ${e.message}`);
  console.log("Please run 'npm run dev' inside your D:\\Persnol\\AI-Portfolio_backend folder first!");
});

req.write(payload);
req.end();
