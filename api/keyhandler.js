import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Estado del servidor
app.get("/status", (req, res) => {
  res.json({ message: "✅ Servidor ADUIA funcionando correctamente" });
});

// ChatGPT endpoint
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Falta la API Key de OpenAI" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    res.json(completion);
  } catch (error) {
    console.error("❌ Error al contactar OpenAI:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ADUIA corriendo en el puerto ${PORT}`));
