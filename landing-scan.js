//Элементы страницы index
const btnScan = document.querySelector(".btn_scan");

const statuses = ["success", "error", "warning"];

// Генерируем случайный индекс от 0 до 2
const randomIndex = Math.floor(Math.random() * statuses.length);

// Получаем случайное значение
const randomStatus = statuses[randomIndex];

// ---СЛУШАТЕЛИ СОБЫТИЙ--- //

btnScan.addEventListener("click", () => {
  window.location.href = `scan-result.html?data=${encodeURIComponent(
    randomStatus
  )}`;
});
