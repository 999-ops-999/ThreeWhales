import fs from "fs";
import { fetchLottoMax } from "./fetchLottoMax.js";
import { fetchLotto649 } from "./fetchLotto649.js";
import { fetchDailyGrand } from "./fetchDailyGrand.js";

(async () => {
  try {
    const lottoMax = await fetchLottoMax();
    const lotto649 = fetchLotto649();
    const dailyGrand = fetchDailyGrand();

    const data = { lotto_max: lottoMax, lotto_649: lotto649, daily_grand: dailyGrand };
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("data.json успешно обновлен!");
  } catch (err) {
    console.error("Ошибка обновления данных:", err);
  }
})();
