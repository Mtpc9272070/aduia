import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/", async (req, res) => {
  const key = process.env.API_KEY;

  if (!key) {
    return res.status(500).json({ error: "API key no configurada" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    });

    const data = await response.json();
    res.status(200).json({ message: "Conexión segura exitosa", data });

  } catch (err) {
    res.status(500).json({ error: "Error al conectar con la API", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
