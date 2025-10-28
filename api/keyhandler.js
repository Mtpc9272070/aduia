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
    // 1. Desestructuramos para OMITIR los campos NO reconocidos por OpenAI.
    // Omitimos 'schema' y capturamos solo los campos válidos para la API de chat.
    const { messages, model, response_format, stream, temperature, tools, tool_choice, ...rest } = req.body; 

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: "Falta la API Key de OpenAI" });
    }
    
    // Validación básica (se mantiene)
    if (!messages) {
        return res.status(400).json({ error: "Payload no válido. Faltan mensajes." });
    }

    try {
        const openai = new OpenAI({ apiKey: process.env.API_KEY });

        // 2. Enviamos SOLO los campos que OpenAI reconoce
        const completion = await openai.chat.completions.create({
            messages,
            model,
            response_format, // Esto contiene { type: "json_object" }
            stream,
            temperature,
            tools,
            tool_choice
            // Aquí puedes agregar cualquier otro parámetro estándar de OpenAI que uses
        });

        res.json(completion);
    } catch (error) {
        console.error("❌ Error al contactar OpenAI:", error);
        // Devolvemos el error de la IA con un código de estado de servidor 500
        // Aseguramos devolver un JSON aquí.
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ ADUIA corriendo en el puerto ${PORT}`));
