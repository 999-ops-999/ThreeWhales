import puppeteer from "puppeteer";

function nextDrawDate(lastDate, daysOfWeek) {
  const from = new Date(lastDate);
  const nextDates = daysOfWeek.map(d => {
    const date = new Date(from);
    while (date.getDay() !== d) date.setDate(date.getDate() + 1);
    return date;
  });
  return nextDates.sort((a,b)=>a-b)[0];
}

export async function fetchLottoMax() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://ontariolotterylive.com/lotto-max-numbers", { waitUntil: "domcontentloaded" });

  const data = await page.evaluate(() => {
    const dateEl = document.querySelector(".centred .date");
    const ballsEls = document.querySelectorAll(".centred .resultBall.ball");
    const bonusEl = document.querySelector(".centred .bonus-ball");
    const jackpotEl = document.querySelector(".jackpot.red");

    const dateStr = dateEl ? dateEl.textContent.trim() : null;
    const balls = Array.from(ballsEls).map(el => Number(el.textContent.trim()));
    const bonus = bonusEl ? Number(bonusEl.textContent.trim()) : null;
    const jackpot = jackpotEl ? jackpotEl.textContent.trim() : null;

    return { dateStr, balls, bonus, jackpot };
  });

  await browser.close();

  const lastDrawDate = new Date(data.dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"));
  const nextDraw = nextDrawDate(lastDrawDate, [2,5]); // Tue, Fri

  return {
    last_draw_date: lastDrawDate.toDateString(),
    next_draw_date: nextDraw.toDateString(),
    jackpot: data.jackpot,
    last_numbers: data.balls,
    bonus: data.bonus
  };
}
