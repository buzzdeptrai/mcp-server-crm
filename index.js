import express from "express";
import cors from "cors";
import { search_booking, confirm_booking } from "./crm.js";

const app = express();
app.use(cors());
app.use(express.json());

// 👇 Danh sách tools trả về cho agent (RowBoat Labs, AutoGen, v.v.)
const tools = [
  {
    name: "search_booking",
    description: "Tìm thông tin booking theo tên khách",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Tên khách cần tìm"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "confirm_booking",
    description: "Xác nhận booking với thông tin khách",
    parameters: {
      type: "object",
      properties: {
        bookingId: { type: "string", description: "Mã booking" },
        guest: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" }
          },
          required: ["name", "email", "phone"]
        }
      },
      required: ["bookingId", "guest"]
    }
  }
];

// 👇 Endpoint SSE — trả về tools cho RowBoat Labs
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const initPayload = {
    status: "ready",
    tools
  };

  res.write(`event: init\ndata: ${JSON.stringify(initPayload)}\n\n`);

  req.on("close", () => {
    console.log("SSE connection closed");
  });
});

// 👇 Endpoint để gọi tool thật sự (hàm xử lý backend)
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
