import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Estado del servidor

// RUTA DE BIENVENIDA AÑADIDA PARA EVITAR "Cannot GET /"
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "ADUIA API is running. Use the /chat endpoint for interaction." });
});
app.post("/image", async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "Falta la API Key de OpenAI" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.API_KEY });

    // Llamada al modelo de generación de imágenes (DALL-E)
    const response = await openai.images.generate({
      model: "dall-e-3", // Usa DALL-E 2 para 512x512, o DALL-E 3 para 1024x1024 o superior
      prompt: prompt,
      n: 1, 
      size: "1024x1024",
      quality: "standard",
      response_format: 'url'
    });

    // Devuelve la URL de la imagen.
    // Usamos .data[0].url porque la respuesta de DALL-E es un array de URLs.
    res.json(response.data[0].url); 
  } catch (error) {
    console.error("❌ Error al contactar DALL-E:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
});
// ChatGPT endpoint
app.post("/chat", async (req, res) => {
  // CORRECCIÓN: Capturamos el body completo como payload
  const payload = req.body; 

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "Falta la API Key de OpenAI" });
  }
  
  // Validación básica
  if (!payload || !payload.messages) {
      return res.status(400).json({ error: "Payload no válido. Faltan mensajes." });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.API_KEY });

    // ENVIAMOS EL PAYLOAD COMPLETO DIRECTAMENTE AL API DE OPENAI
    const completion = await openai.chat.completions.create({
      ...payload
    });

    res.json(completion);
  } catch (error) {
    console.error("❌ Error al contactar OpenAI:", error);
    // Devolvemos el error de la IA con un código de estado de servidor 500
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ADUIA corriendo en el puerto ${PORT}`));
