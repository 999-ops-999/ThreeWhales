// update649Card.js
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "en";
  const dataUrl = "https://999-ops-999.github.io/ThreeWhales/data.json";

  fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error("Не удалось загрузить data.json");
      return res.json();
    })
    .then(data => {
      if (!data.lotto_649) return console.warn("Нет данных Lotto 6/49");
      updateLotto649Card(data.lotto_649, lang);
    })
    .catch(err => console.error("Ошибка загрузки data.json:", err));
});

function updateLotto649Card(lottoData, lang = "en") {
  const dateEl = document.getElementById("lotto_649-nextDrawDate");
  const jackpotEl = document.getElementById("lotto_649-jackpotAmount");
  const goldBallEl = document.getElementById("lotto_649-goldBallAmount");
  const numbersEl = document.getElementById("lotto_649-lastNumbers");

  if (!dateEl || !jackpotEl || !numbersEl) {
    console.error("Элементы карточки Lotto 6/49 не найдены!");
    return;
  }

  // --- Дата ---
  let dateText = lottoData.next_draw_date || "—";
  if (lang === "fr" && dateText && dateText !== "—") {
    try {
      const parsed = new Date(dateText);
      dateText = parsed.toLocaleDateString("fr-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      console.warn("[update649Card] ошибка форматирования даты");
    }
  }
  dateEl.textContent = dateText;

  // --- Джекпот ---
  jackpotEl.textContent = lottoData.jackpot || "—";

  // --- Голден болл ---
  if (goldBallEl) goldBallEl.textContent = lottoData.golden_ball || "—";

  // --- Шары ---
  if (Array.isArray(lottoData.last_numbers)) {
    const ballsHTML = lottoData.last_numbers
      .map(n => `<span class="ball">${n}</span>`)
      .join(" ");
    numbersEl.innerHTML = ballsHTML;
  } else {
    numbersEl.textContent = "—";
  }
}

