import express from "express";
import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import crypto from "crypto"; // 🌙 <── Adicione esta linha

// Torna o módulo crypto global (Baileys espera isso)
global.crypto = crypto;

const app = express();
const port = process.env.PORT || 10000;

// Inicializa o servidor web
app.get("/", (req, res) => {
  res.send("🌙 TsukiBotV2 está vivo e dançando sob o luar.");
});

app.listen(port, () => {
  console.log(`🚀 Servidor ativo na porta ${port}`);
});

// Função principal do bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ["TsukiBotV2", "Chrome", "1.0.0"],
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Escaneie este QR Code para conectar o TsukiBotV2");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      console.log("❌ Conexão encerrada, tentando reconectar...");
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ TsukiBotV2 conectado com sucesso!");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

startBot();
