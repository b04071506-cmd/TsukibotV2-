// TsukiBot V2 — O robô de Tsukishima
// Autor: Tsuki 🌙
// Versão: 2.0 — simples, poético e leve

import express from "express";
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌙 TsukiBot V2 está vivo no Render — O guardião de Tsukishima desperto!");
});

app.listen(port, () => {
  console.log(`🚀 Servidor ativo em http://localhost:${port}`);
});

// Função principal do bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) qrcode.generate(qr, { small: true });

    if (connection === "open") {
      console.log("✅ TsukiBot V2 conectado ao WhatsApp!");
    } else if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log("⚠️ Conexão encerrada:", reason);
      if (reason !== DisconnectReason.loggedOut) startBot();
      else console.log("🚫 Sessão encerrada. Escaneie o QR novamente.");
    }
  });

  // Resposta automática simples
  sock.ev.on("messages.upsert", async (msg) => {
    try {
      const message = msg.messages[0];
      if (!message.message || message.key.fromMe) return;

      const from = message.key.remoteJid;
      const text = message.message.conversation?.toLowerCase() || "";

      if (text.includes("tsuki")) {
        await sock.sendMessage(from, { text: "🌙 Chamou o Tsuki? Estou aqui, sempre à sombra do luar." });
      } else if (text.includes("oi")) {
        await sock.sendMessage(from, { text: "✨ Olá, viajante. O luar te trouxe até mim?" });
      }
    } catch (err) {
      console.error("Erro ao processar mensagem:", err);
    }
  });
}

// Iniciar o bot
startBot();
