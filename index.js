import express from "express";
import cors from "cors";
import { search_booking, confirm_booking } from "./crm.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`event: init\ndata: ${JSON.stringify({ status: "ready" })}\n\n`);

  req.on("close", () => {
    console.log("SSE connection closed");
  });
});

// MCP logic
app.post("/call", async (req, res) => {
  const { function_call, arguments: args } = req.body;

  try {
    let result;

    if (function_call === "search_booking") {
      result = search_booking(args);
    } else if (function_call === "confirm_booking") {
      result = confirm_booking(args);
    } else {
      throw new Error("Function not supported");
    }

    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ MCP Server running at http://localhost:${PORT}`);
});
