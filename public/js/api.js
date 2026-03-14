const DADATA_TOKEN = "...token";

export const API = {
  async getSuggestions(query) {
    if (!query) return [];
    try {
      const response = await fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + DADATA_TOKEN,
          },
          body: JSON.stringify({ query, count: 5 }),
        },
      );
      const data = await response.json();
      return data.suggestions;
    } catch (err) {
      console.error("DaData error:", err);
      return [];
    }
  },

  async sendForm(formData) {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return await response.json();
  },
};
