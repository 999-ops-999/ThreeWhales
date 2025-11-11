import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";

// Функция для вычисления следующего розыгрыша
function nextDrawDate(lastDate, daysOfWeek) {
  const from = new Date(lastDate);
  const nextDates = daysOfWeek.map(d => {
    const date = new Date(from);
    while (date.getDay() !== d) date.setDate(date.getDate() + 1);
    return date;
  });
  return nextDates.sort((a, b) => a - b)[0];
}

async function fetchLottoMax() {
  const url = "https://ontariolotterylive.com/lotto-max-numbers";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const dateStr = $(".centred .date").text().trim(); 
  const lastDrawDate = new Date(dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"));

  const balls = $(".centred .resultBall.ball")
    .map((i, el) => Number($(el).text()))
    .get();
  const bonus = Number($(".centred .bonus-ball").text());
  const jackpot = $(".jackpot.red").first().text().trim();

  const nextDraw = nextDrawDate(lastDrawDate, [2, 5]); // Tue, Fri

  return {
    last_draw_date: lastDrawDate.toDateString(),
    next_draw_date: nextDraw.toDateString(),
    jackpot,
    last_numbers: balls,
    bonus
  };
}

// Для примера: 649 и Daily Grand будут статические (можно добавить парсинг)
function getLotto649() {
  return {
    next_draw_date: "Saturday, November 16, 2025",
    jackpot: "$10 Million",
    last_numbers: [3, 14, 22, 27, 35, 44],
    golden_ball: 12
  };
}

function getDailyGrand() {
  return {
    next_draw_date: "Monday, November 10, 2025",
    jackpot: "$1,000 a Day for Life",
    last_numbers: [7, 18, 21, 29, 36],
    bonus: 9
  };
}

async function updateData() {
  try {
    const lottoMax = await fetchLottoMax();
    const data = {
      lotto_max: lottoMax,
      lotto_649: getLotto649(),
      daily_grand: getDailyGrand()
    };

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("data.json успешно обновлен!");
  } catch (err) {
    console.error("Ошибка обновления данных:", err);
  }
}

updateData();
