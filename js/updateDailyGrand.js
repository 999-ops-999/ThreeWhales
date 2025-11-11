// --- updateDailyGrand.js ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("[updateDailyGrand.js] loaded");

  const lang = localStorage.getItem("lang") || "en";
  const dataUrl = "https://999-ops-999.github.io/ThreeWhales/data.json";

  fetch(dataUrl)
    .then(res => {
      if (!res.ok) throw new Error("Не удалось загрузить data.json");
      return res.json();
    })
    .then(data => {
      if (!data.daily_grand) {
        console.warn("No Daily Grand data found");
        return;
      }
      updateDailyGrandCard(data.daily_grand, lang);
    })
    .catch(err => console.error("Error loading Daily Grand data:", err));
});

function updateDailyGrandCard(lottoData, lang = "en") {
  const dateEl = document.getElementById("daily_grand-nextDrawDate");
  const jackpotEl = document.getElementById("daily_grand-jackpotAmount");
  const numbersEl = document.getElementById("daily_grand-lastNumbers");

  if (!dateEl || !jackpotEl || !numbersEl) {
    console.warn("[Daily Grand] Elements not found in DOM");
    return;
  }

  // --- Дата с учётом языка ---
  let dateText = lottoData.next_draw_date || "—";
  if (lang === "fr" && dateText !== "—") {
    try {
      const parsed = new Date(dateText);
      dateText = parsed.toLocaleDateString("fr-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      console.warn("[updateDailyGrand] ошибка форматирования даты");
    }
  }

  dateEl.textContent = dateText;
  jackpotEl.textContent = lottoData.jackpot || "—";

  // --- Шары ---
  if (Array.isArray(lottoData.last_numbers)) {
    let ballsHTML = lottoData.last_numbers
      .map(num => `<span class="ball">${num}</span>`)
      .join(" ");

    // Бонусный (Grand Number)
    if (lottoData.bonus) {
      ballsHTML += ` <span class="plus">+</span> <span class="bonus-ball">${lottoData.bonus}</span>`;
    }

    numbersEl.innerHTML = ballsHTML;
  } else {
    numbersEl.textContent = "—";
  }
}
