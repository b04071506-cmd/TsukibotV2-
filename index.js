import express from "express";
import makeWASocket from "@whiskeysockets/baileys";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("TsukiBot V2 está vivo 🌙"));

app.listen(port, () => console.log(`🌌 Servidor ativo na porta ${port}`));

// --- WhatsApp Connection ---
async function startBot() {
  const sock = makeWASocket({});
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") console.log("✅ TsukiBot conectado ao WhatsApp!");
    if (connection === "close") console.log("❌ Conexão perdida, tentando reconectar...");
  });

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (text?.toLowerCase() === "oi tsuki") {
      await sock.sendMessage(from, { text: "🌙 Olá, aqui é o TsukiBot V2!" });
    }
  });
}

startBot();
