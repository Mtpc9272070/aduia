import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para comprobar estado
app.get("/status", (req, res) => {
  res.json({ message: "✅ Servidor ADUIA en línea y operativo" });
});

// Ruta del chat (usa tu API Key segura)
app.post("/chat", async (req, res) => {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "Falta la API key en el servidor" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error al conectar con OpenAI:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Servidor ADUIA corriendo en el puerto ${PORT}`));
