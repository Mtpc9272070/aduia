import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// ✅ Permite el acceso desde tu origen local
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500", "https://tudominio.com"]
}));

app.get("/status", (req, res) => {
  res.json({ message: "API funcionando correctamente 🚀" });
});

app.get("/", async (req, res) => {
  const key = process.env.API_KEY;

  if (!key) return res.status(500).json({ error: "API key no configurada" });

  const response = await fetch("https://api.openai.com/v1/models", {
    headers: { "Authorization": `Bearer ${key}` }
  });

  const data = await response.json();
  res.json({ message: "Conexión segura exitosa", data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
