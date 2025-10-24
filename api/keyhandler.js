export default async function handler(req, res) {
  const key = process.env.API_KEY;

  if (!key) {
    return res.status(500).json({ error: "API key no configurada" });
  }

  // Ejemplo: usar la key en una llamada a una API externa
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: {
      "Authorization": `Bearer ${key}`
    }
  });

  const data = await response.json();

  return res.status(200).json({
    message: "Conexión segura exitosa",
    data
  });
}
