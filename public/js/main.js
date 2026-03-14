import { initPhoneMask } from "./mask.js";
import { API } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const phoneInput = document.getElementById("phone");
  const submitBtn = document.getElementById("submitBtn");
  const responseMsg = document.getElementById("formResponse");

  initPhoneMask(phoneInput);

  const setupSuggestions = (id) => {
    const input = document.getElementById(id);
    const container = document.getElementById(`${id}Suggestions`);
    let timeout;

    input.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const suggestions = await API.getSuggestions(input.value);
        if (suggestions.length > 0) {
          container.innerHTML = suggestions
            .map((s) => `<div class="suggestion-item">${s.value}</div>`)
            .join("");
          container.style.display = "block";
        } else {
          container.style.display = "none";
        }
      }, 300);
    });

    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("suggestion-item")) {
        input.value = e.target.innerText;
        container.style.display = "none";
      }
    });
  };

  setupSuggestions("lastName");
  setupSuggestions("firstName");
  setupSuggestions("middleName");

  window.onloadCaptchaCallback = () => {
    window.smartCaptcha.render("captcha-container", {
      sitekey: "...key",
      callback: (token) => {
        window.captchaToken = token;
      },
    });
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.captchaToken) {
      alert("Пожалуйста, подтвердите, что вы не робот");
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    data.captchaToken = window.captchaToken;

    try {
      form.classList.add("loading");
      submitBtn.disabled = true;

      const result = await API.sendForm(data);

      if (result.success) {
        responseMsg.innerText = "Сообщение успешно отправлено!";
        responseMsg.className = "form-response success";
        form.reset();
        window.smartCaptcha.reset();
      } else {
        throw new Error(result.message || "Ошибка сервера");
      }
    } catch (err) {
      responseMsg.innerText = err.message;
      responseMsg.className = "form-response error";
    } finally {
      form.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
});
