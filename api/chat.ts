import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel Serverless Function kiểu Node
export default async function handler(req: any, res: any) {
  // Chỉ cho phép POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Missing user message" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      res.status(500).json({ error: "Server config error" });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const replyText = result.response.text();

    res.status(200).json({ reply: replyText });
  } catch (err: any) {
    console.error("API /api/chat error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
