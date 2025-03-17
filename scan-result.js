// Элементы страницы scan-result
const bodyEl = document.body;
const successResult = document.querySelector(".success-result");
const errorResult = document.querySelector(".error-result");
const warningResult = document.querySelector(".warning-result");
const loader = document.querySelector(".loader");

const params = new URLSearchParams(window.location.search);
const data = params.get("data");

//Показать блок в зависимости от результата сканирования

window.addEventListener('DOMContentLoaded', () => {
    // Запускаем таймер
    setTimeout(() => {
        loader.classList.add("hidden");
        if (data === "success") {
            successResult.classList.remove("hidden");
          } else if (data === "error") {
            errorResult.classList.remove("hidden");
          } else if (data === "warning") {
            warningResult.classList.remove("hidden");
          }
    }, 5000);
  });

