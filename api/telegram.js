export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("Telegram bot is running");
    }

    const update = req.body || {};
    const message = update.message;
    const chatId = message?.chat?.id;
    const text = message?.text || "";

    if (!chatId) {
      return res.status(200).json({ ok: true });
    }

    let reply = "안녕하세요! 새 봇이 정상 작동 중입니다.";

    if (text === "/start") {
      reply = "✅ 봇이 연결되었습니다.\n이제 알림 기능을 다시 붙일 수 있어요.";
    }

    if (text.includes("안녕")) {
      reply = "안녕! 봇 연결 성공입니다 ✅";
    }

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("BOT_ERROR:", error);
    return res.status(200).json({ ok: false });
  }
}
