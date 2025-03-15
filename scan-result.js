// Элементы страницы scan-result
const bodyEl = document.body;
const successResult = document.querySelector(".success-result");
const errorResult = document.querySelector(".error-result");
const warningResult = document.querySelector(".warning-result");

const params = new URLSearchParams(window.location.search);
const data = params.get("data");

if (data === "success") {
  successResult.classList.remove("hidden");
} else if (data === "error") {
  errorResult.classList.remove("hidden");
} else if (data === "warning") {
  warningResult.classList.remove("hidden");
}
