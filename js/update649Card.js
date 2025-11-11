//update649Card.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("[update649Card.js] loaded");

    // Определяем язык интерфейса
  const lang = localStorage.getItem("lang") || "en";

  // Путь к JSON на GitHub Pages
 const dataUrl = "https://999-ops-999.github.io/ThreeWhales/data.json";

    fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error("Не удалось загрузить data.json");
      return res.json();
    })
    .then(data => {
      console.log("[update649Card] data loaded:", data);
      updateLotto649Card(data.lotto_649);
    })
    .catch(err => console.error("Ошибка загрузки data.json:", err));
});

function updateLotto649Card(lottoData) {
  if (!lottoData) {
    console.warn("Нет данных для Lotto 6/49");
    return;
  }

  const dateEl = document.getElementById("lotto_649-nextDrawDate");
  const jackpotEl = document.getElementById("lotto_649-jackpotAmount");
  const goldBallEl = document.getElementById("lotto_649-goldBallAmount");
  const numbersEl = document.getElementById("lotto_649-lastNumbers");

  if (!dateEl || !jackpotEl || !numbersEl) {
    console.error("Элементы карточки Lotto 6/49 не найдены!");
    return;
  }

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
  jackpotEl.textContent = lottoData.jackpot || "—";
  goldBallEl.textContent = lottoData.golden_ball || "—";

  if (Array.isArray(lottoData.last_numbers)) {
    let nums = lottoData.last_numbers
      .map(n => `<span class="ball">${n}</span>`)
      .join(" ");

    if (lottoData.bonus) {
      nums += ` <span class="plus">+</span> <span class="bonus-ball">${lottoData.bonus}</span>`;
    }

    numbersEl.innerHTML = nums;
  } else {
    numbersEl.textContent = "—";
  }
}
