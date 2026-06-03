export default async function handler(req, res) {
  try {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!chatId || !token) {
      return res.status(200).json({
        ok: false,
        error: "Missing TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN"
      });
    }

    const message = "✅ 테스트 알림 성공!\nVercel에서 텔레그램으로 알림을 보낼 수 있습니다.";

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      telegram: data
    });
  } catch (error) {
    console.error("TEST_ALERT_ERROR:", error);
    return res.status(200).json({
      ok: false,
      error: String(error)
    });
  }
}
