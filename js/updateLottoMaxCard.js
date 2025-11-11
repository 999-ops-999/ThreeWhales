// js/updateLottoMaxCard.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("[updateLottoMax.js] loaded");

  // Определяем язык интерфейса
  const lang = localStorage.getItem("lang") || "en";

  // Путь к JSON на GitHub Pages
 const dataUrl = "https://999-ops-999.github.io/ThreeWhales/data.json";


  fetch(dataUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Не удалось загрузить data.json");
      return res.json();
    })
    .then((data) => {
      console.log("[updateLottoMax] data loaded:", data);
      updateLottoMaxCard(data.lotto_max, lang);
    })
    .catch((err) => {
      console.error("Ошибка загрузки data.json:", err);
    });
});

function updateLottoMaxCard(lottoData, lang = "en") {
  if (!lottoData) {
    console.warn("Нет данных для Lotto Max");
    return;
  }

  const dateEl = document.getElementById("lotto_max-nextDrawDate");
  const jackpotEl = document.getElementById("lotto_max-jackpotAmount");
  const numbersEl = document.getElementById("lotto_max-lastNumbers");

  if (!dateEl || !jackpotEl || !numbersEl) {
    console.error("Элементы карточки Lotto Max не найдены!");
    return;
  }

  // Переводим дату на французский, если нужно
  let dateText = lottoData.last_draw_date || "—";
  if (lang === "fr" && dateText && dateText !== "—") {
    try {
      const parsed = new Date(dateText.replace(/(\d+)(st|nd|rd|th)/, "$1"));
      dateText = parsed.toLocaleDateString("fr-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      console.warn("[updateLottoMax] ошибка форматирования даты");
    }
  }

  dateEl.textContent = dateText;
  jackpotEl.textContent = lottoData.jackpot || "—";

  // Шары
  if (Array.isArray(lottoData.last_numbers)) {
    let nums = lottoData.last_numbers
      .map((n) => `<span class="ball">${n}</span>`)
      .join(" ");

    if (lottoData.bonus) {
      nums += ` <span class="plus">+</span> <span class="bonus-ball">${lottoData.bonus}</span>`;
    }

    numbersEl.innerHTML = nums;
  } else {
    numbersEl.textContent = "—";
  }
}


