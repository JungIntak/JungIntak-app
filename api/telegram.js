export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("Telegram AI bot is running");
    }

    const update = req.body || {};
    const message = update.message;
    const chatId = message?.chat?.id;
    const text = message?.text || "";

    if (!chatId) {
      return res.status(200).json({ ok: true });
    }

    let reply = "";

    if (text === "/start") {
      reply = "✅ AI 비서 봇이 연결되었습니다.\n이제 질문을 보내면 답변할 수 있어요.";
    } else if (text === "내아이디") {
      reply = `당신의 chat_id는 ${chatId} 입니다.`;
    } else if (!process.env.OPENAI_API_KEY) {
      reply = "OPENAI_API_KEY가 Vercel에 없습니다.";
    } else {
      const aiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini"
          input: [
            {
              role: "system",
              content:
                "너는 사용자의 한국어 개인 비서다. 아주 쉽고 짧게 답한다. 사용자가 초등학생이라고 생각하고 복잡한 말은 피한다. 단계가 필요하면 1개씩만 말한다."
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      });

      const data = await aiResponse.json();

      if (!aiResponse.ok) {
        console.error("OPENAI_ERROR:", data);
        reply = "AI 답변 중 오류가 났어요. Vercel 로그를 확인해야 합니다.";
      } else {
        reply =
          data.output_text ||
          data.output?.[0]?.content?.[0]?.text ||
          "답변을 만들지 못했어요.";
      }
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

    return res.status(200).json({
      ok: false,
      error: String(error)
    });
  }
}
