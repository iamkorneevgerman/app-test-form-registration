const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_PATH = path.join(__dirname, "data", "messages.json");

const validate = (data) => {
  const { lastName, firstName, phone, email } = data;
  if (!lastName || !firstName || !phone || !email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

app.post("/api/feedback", async (req, res) => {
  const body = req.body;

  try {
    const captchaRes = await axios.get(
      `https://smartcaptcha.yandexcloud.net/validate`,
      {
        params: {
          secret: "...key",
          token: body.captchaToken,
          ip: req.ip,
        },
      },
    );

    if (captchaRes.data.status !== "ok") {
      return res
        .status(400)
        .json({ success: false, message: "Капча не пройдена" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Ошибка проверки капчи" });
  }

  if (!validate(body)) {
    return res
      .status(400)
      .json({ success: false, message: "Некорректные данные" });
  }

  try {
    let messages = [];
    try {
      const fileData = await fs.readFile(DATA_PATH, "utf8");
      messages = JSON.parse(fileData);
    } catch (e) {}

    const newMessage = {
      lastName: body.lastName,
      firstName: body.firstName,
      middleName: body.middleName,
      phone: body.phone,
      email: body.email,
      topic: body.topic,
      message: body.message,
      date: new Date().toISOString(),
    };

    messages.push(newMessage);
    await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Ошибка записи данных" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
