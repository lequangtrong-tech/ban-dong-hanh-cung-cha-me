import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing user message" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);

    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export const config = {
  runtime: "edge",
};
