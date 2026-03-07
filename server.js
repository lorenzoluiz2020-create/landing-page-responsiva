import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())

// Servir arquivos da raiz do projeto
app.use(express.static(__dirname))

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post("/chat", async (req, res) => {
  const message = req.body.message

  if (!message || !message.trim()) {
    return res.status(400).json({
      reply: "Envie uma mensagem válida."
    })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é a IA do site ZYPE. Responda em português do Brasil, de forma clara, útil e organizada."
        },
        {
          role: "user",
          content: message
        }
      ]
    })

    res.json({
      reply: completion.choices[0].message.content || "Sem resposta no momento."
    })
  } catch (err) {
    console.error("Erro na OpenAI:", err)

    res.status(500).json({
      reply: "Erro ao acessar IA."
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT)
})