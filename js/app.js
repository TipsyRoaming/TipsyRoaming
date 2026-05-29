import { initI18n } from "./i18n.js";
import { initSearch } from "./search.js";
import { initWeather } from "./weather.js";
import { initUI } from "./ui.js";
import { initReview } from "./review.js";

document.addEventListener("DOMContentLoaded", () => {
    initI18n();
    initSearch();
    initWeather();
    initUI();
    initReview();
});