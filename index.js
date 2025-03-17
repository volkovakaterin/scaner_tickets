// Элементы страницы create-flyer
const bodyEl = document.body;
const sectionCreateFlyer = document.querySelector(".create_flyer");
const posterBoxEl = document.querySelector(".poster_box");
const fileInput = document.getElementById("poster-load");
const posterLoadLabel = document.querySelector(".poster_load_label");
const posterLoadLabelText = posterLoadLabel.querySelector(".poster_load_text");
const poster = document.getElementById("poster");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const qrIconEl = sectionCreateFlyer.querySelector(".qr-icon");
const qrIconSvg = qrIconEl.querySelector("svg");
const inputQrBorderColor = document.getElementById("qr-border-color");
const settingOpen = document.querySelector(".settings_open");
const changeColorBox = document.querySelector(".change_color_box");
const textHeaderEl = document.querySelector(".text-header");
const textHeaderWrapperEl = document.querySelector(".text_wrapper");
const textSecondaryEl = document.querySelector(".text-secondary");
const popupBox = document.querySelector(".popup_box");
const popupSaveBtn = document.querySelector(".popup_save");
const popupCancelBtn = document.querySelector(".popup_cancel");
const maskEl = document.querySelector(".mask");
const selectElementBox = document.querySelector(".select_element_box");
const settingMenuEl = document.querySelector(".setting-menu");
const settingMenuCloseBtn = document.querySelector(".setting-menu_close");
const managerSettingBox = document.querySelector(".manager_setting_box");
const managerSettingColorBtn = document.querySelector(".manager_setting_color");
const settingMenuBackBtn = document.querySelector(".setting-menu_back");
const managerSettingDeleteBtn = document.querySelector(
  ".manager_setting_delete"
);
const editTextBox = document.querySelector(".edit_text_box");
const managerSettingEditBtn = document.querySelector(".manager_setting_edit");
const editTextCloseBtn = document.querySelector(".edit_text_close");
const editTextSaveBtn = document.querySelector(".edit_text_save");
const editTextInput = document.getElementById("edit_text");
const editTextWarning = document.querySelector(".edit_text_warning");

//Создаем палитру
const pickr = Pickr.create({
  el: ".color-picker",
  theme: "nano",
  showAlways: true,

  swatches: [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
  ],

  components: {
    // Main components
    preview: true,
    opacity: true,
    hue: true,

    // Input / output Options
    interaction: {
      input: true,
    },
  },
});

//Скрываем палитру после инициализации
pickr.on("init", () => {
  pickr.hide();
});

const pcrApp = document.querySelector(".pcr-app");
const newBlock = document.createElement("div");
newBlock.classList.add("my-block");

newBlock.innerHTML = `
<div class="added_color_box">
</div>
      <div class="manager_changes_box">
      <button class="btn_secondary manager_changes_btn manager_changes_cancel">Отмена</button>
        <button class="btn_secondary manager_changes_btn manager_changes_save">Сохранить</button>
      </div>
`;

// Добавляем в pcrApp
pcrApp.appendChild(newBlock);

// --- ФУНКЦИИ --- //

//Вставляем на страницу загруженную картинку
function handleFileSelect(event) {
  const file = event.target.files[0]; // Первый (и единственный) выбранный файл
  if (!file) return; // Если не выбрали файл - ничего не делаем

  // Создаём FileReader, чтобы прочитать файл локально
  const reader = new FileReader();
  reader.onload = function (e) {
    // onload - событие успешного чтения файла
    poster.src = e.target.result; // base64-строка, которую ставим в src
    poster.style.display = "block"; // Показываем <img>

    // Меняем кнопку
    posterLoadLabel.classList.remove("btn_secondary");
    posterLoadLabel.classList.add("btn_primary");
    posterLoadLabel.classList.add("absolute");
    posterLoadLabelText.classList.add("hidden");
  };

  // Читаем файл как DataURL (изображение)
  reader.readAsDataURL(file);
}

let addedColors = [];
let lastColor = undefined;

//Устанавливаем цвет для выбранного элемента
function setColor(hexColor) {
  lastColor = hexColor;
  if (selectElement == "border-QR") {
    qrIconEl.style.borderColor = hexColor;
  } else if (selectElement == "icon-QR") {
    qrIconEl.style.color = hexColor;
  } else if (selectElement == "header") {
    textHeaderEl.style.color = hexColor;
  } else if (selectElement == "text") {
    textSecondaryEl.style.color = hexColor;
  }
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

let activeMenu = undefined;
let selectElement = undefined;
let isChanges = false;
let previousSettings = {
  border: {
    color: "#2c75ff",
  },
  icon: {
    color: "#333",
  },
  header: {
    color: "#2c75ff",
    content: "Добро пожаловать!",
    availability: true,
  },
  text: {
    color: "#333333",
    content: "Твой билет в твоем смартфоне",
    availability: true,
  },
};

const btnSettingBorderQr = document.querySelector(".setting_border_qr");
const btnSettingIconQr = document.querySelector(".setting_icon_qr");
const selectElementBtnAll = document.querySelectorAll(".select_element_btn");
const changesSaveBtn = document.querySelector(".manager_changes_save");
const changesCancelBtn = document.querySelector(".manager_changes_cancel");
const addedColorBox = document.querySelector(".added_color_box");

//Открыть панель выбора элемента
function openPanelSelectEl() {
  console.log("Открыть панель выбора элемента");
  settingOpen.classList.add("hidden");
  selectElement = undefined;
  activeMenu = "SELECT_ELEMENT_MENU";
  settingMenuBackBtn.classList.add("hidden");
  selectElementBox.classList.remove("hidden");
  settingMenuEl.classList.remove("hidden");
}

//Закрыть панель выбора элемента
function closePanelSelectEl() {
  console.log("Закрыть панель выбора элемента");
  selectElementBox.classList.add("hidden");
}

//Открыть панель выбора настроек
function openPanelManageSetting() {
  console.log("Открыть панель выбора настроек");
  console.log(selectElement);
  activeMenu = "MANAGE_SETTING_MENU";
  settingMenuBackBtn.classList.remove("hidden");
  closePanelSelectEl();
  if (selectElement !== "header" && selectElement !== "text") {
    console.log(selectElement);
    openPanelPalette();
  } else managerSettingBox.classList.remove("hidden");
}

//Закрыть панель настроек
function closePanelSetting() {
  console.log("Закрыть панель настроек");
  selectElementBox.classList.add("hidden");
  managerSettingBox.classList.add("hidden");
  settingMenuEl.classList.add("hidden");
  settingOpen.classList.remove("hidden");
}

//Открыть панель палитры
function openPanelPalette() {
  console.log("Открыть панель палитры");
  activeMenu = "PALETTE_MENU";
  settingMenuBackBtn.classList.add("hidden");
  closePanelSelectEl();
  managerSettingBox.classList.add("hidden");
  setPreviousSettings();
  pickr.show();
}

//Закрыть панель палитры
function closePanelPalette() {
  console.log("Закрыть панель палитры");
  isChanges = false;
  //selectElement = undefined;
  pickr.hide();
}

//Установить значения в предыдущие натсройки
function setPreviousSettings() {
  console.log("Установить значения в предыдущие натсройки");
  console.log(selectElement);
  previousSettings.border.color = qrIconEl.style.borderColor;
  previousSettings.icon.color = qrIconEl.style.color;
  previousSettings.header.color = textHeaderEl.style.color;
  previousSettings.text.color = textSecondaryEl.style.color;
}

//Вернуться к предыдущим настройкам
function restorePreviousSettings() {
  console.log("Вернуться к предыдущим настройкам");
  qrIconEl.style.borderColor = previousSettings.border.color;
  qrIconEl.style.color = previousSettings.icon.color;
  textHeaderEl.style.color = previousSettings.header.color;
  textSecondaryEl.style.color = previousSettings.text.color;
  textHeaderEl.innerText = previousSettings.header.content;
  textSecondaryEl.innerText = previousSettings.text.content;
}

function openPopup() {
  console.log("Открыть попап");
  maskEl.classList.add("visible");
  popupBox.classList.add("visible");
  bodyEl.classList.add("overflow");
}

function closePopup() {
  console.log("Закрыть попап");
  popupBox.classList.remove("visible");
  maskEl.classList.remove("visible");
  bodyEl.classList.remove("overflow");
}

function addLastColor() {
  if (
    !addedColors.includes(lastColor) &&
    !pickr.options.swatches.includes(lastColor)
  ) {
    if (addedColors.length < 7) {
      addedColors.push(lastColor);
      addedColors.forEach((clr) => {
        if (
          !addedColorBox.querySelector(`.added_color_btn[data-color="${clr}"]`)
        ) {
          const btn = document.createElement("button");
          btn.classList.add("added_color_btn");
          btn.setAttribute("data-color", clr);
          btn.style.backgroundColor = clr;
          addedColorBox.appendChild(btn);
        }
      });
    } else {
      addedColors[0] = lastColor;
      addedColors.forEach((clr) => {
        if (
          !addedColorBox.querySelector(`.added_color_btn[data-color="${clr}"]`)
        ) {
          const firstBtn = addedColorBox.querySelector(".added_color_btn");
          firstBtn.dataset.color = clr;
          firstBtn.style.backgroundColor = clr;
        }
      });
    }
  }
}

// ---СЛУШАТЕЛИ СОБЫТИЙ--- //

fileInput.addEventListener("change", handleFileSelect);

// Когда картинка загрузится, рисуем её на canvas
poster.addEventListener("load", () => {
  canvas.width = poster.width;
  canvas.height = poster.height;

  // Получаем реальную ширину/высоту картинки
  const imgWidth = poster.naturalWidth;
  const imgHeight = poster.naturalHeight;

  // Соотношение сторон
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvas.width / canvas.height;

  let drawWidth, drawHeight;
  let offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    // Изображение "шире" канваса по соотношению:
    // подгоняем по ширине, оставляем поля сверху/снизу
    drawWidth = canvas.width;
    drawHeight = drawWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvas.height - drawHeight) / 2; // центрируем по вертикали
  } else {
    // Изображение "уже", либо совпадает по ширине — подгоняем по высоте
    drawHeight = canvas.height;
    drawWidth = drawHeight * imgRatio;
    offsetX = (canvas.width - drawWidth) / 2; // центрируем по горизонтали
    offsetY = 0;
  }

  // Чистим канвас (по желанию, если нужно)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем изображение с масштабированием и смещением (offset)
  ctx.drawImage(poster, offsetX, offsetY, drawWidth, drawHeight);
});

// При клике на canvas
canvas.addEventListener("click", (e) => {
  if (selectElement && activeMenu == "PALETTE_MENU") {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;

    // Преобразуем в hex
    const hex = rgbToHex(r, g, b);
    pickr.setColor(hex);
    setColor(hex);
  }
});

//При изменении цвета на палитре
pickr.on("change", (color, instance) => {
  isChanges = true;
  const hexColor = color.toHEXA().toString();
  console.log("Выбранный цвет (HEX):", hexColor);
  setColor(hexColor);
});

//Сохранить изменения в натсройках и закрыть панель
changesSaveBtn.addEventListener("click", () => {
  if (isChanges) {
    addLastColor();
    setPreviousSettings();
  }
  closePanelPalette();
  if (selectElement !== "header" && selectElement !== "text") {
    openPanelSelectEl();
  } else {
    managerSettingBox.classList.remove("hidden");
    activeMenu = "MANAGE_SETTING_MENU";
    settingMenuBackBtn.classList.remove("hidden");
  }
});

addedColorBox.addEventListener("click", (event) => {
  // Находим ближайший элемент с классом .added_color_btn, если он есть
  const btn = event.target.closest(".added_color_btn");
  console.log(btn, "btn");
  console.log(btn, "event");
  // Если клик произошёл не по кнопке, выходим
  if (!btn) return;

  console.log("Кнопка палитры");
  isChanges = true;

  // Если кнопке назначен id, его можно получить через btn.id
  const hexColor = btn.getAttribute("data-color");
  console.log("Выбранный цвет (HEX):", hexColor);

  setColor(hexColor);
});

//Отменить изменения в настройках и закрыть панель
changesCancelBtn.addEventListener("click", () => {
  if (isChanges) {
    openPopup();
  } else {
    closePanelPalette();
    if (selectElement !== "header" && selectElement !== "text") {
      console.log(selectElement);
      openPanelSelectEl();
    } else {
      managerSettingBox.classList.remove("hidden");
      activeMenu = "MANAGE_SETTING_MENU";
      settingMenuBackBtn.classList.remove("hidden");
    }
  }
});

popupSaveBtn.addEventListener("click", () => {
  console.log("popupSaveBtn");
  addLastColor();
  closePanelPalette();
  if (selectElement !== "header" && selectElement !== "text") {
    openPanelSelectEl();
  } else {
    if (activeMenu == "EDIT_TEXT_MENU") {
      previousSettings[selectElement].content = editTextInput.value;
    }
    editTextBox.classList.add("hidden");
    settingMenuEl.classList.remove("hidden");
    managerSettingBox.classList.remove("hidden");
    activeMenu = "MANAGE_SETTING_MENU";
    settingMenuBackBtn.classList.remove("hidden");
  }
  closePopup();
});

popupCancelBtn.addEventListener("click", () => {
  console.log("popupCancelBtn");
  restorePreviousSettings();
  closePanelPalette();
  if (selectElement !== "header" && selectElement !== "text") {
    openPanelSelectEl();
  } else {
    editTextBox.classList.add("hidden");
    settingMenuEl.classList.remove("hidden");
    managerSettingBox.classList.remove("hidden");
    activeMenu = "MANAGE_SETTING_MENU";
    settingMenuBackBtn.classList.remove("hidden");
  }
  closePopup();
});

//Закрываем панель настроек при клике вне её
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".canvas_poster") &&
    !e.target.closest(".settings_open") &&
    !e.target.closest(".pcr-app") &&
    !e.target.closest(".select_element_btn") &&
    !e.target.closest(".setting-menu") &&
    !e.target.closest(".popup_box") &&
    !e.target.closest(".edit_text_box")
  ) {
    if (isChanges) {
      openPopup();
    } else {
      closePanelPalette();
      closePanelSetting();
      selectElement = undefined;
      activeMenu = undefined;
      isChanges = false;
      lastColor = undefined;
    }
  }
});

//Выбираем элемент для настройки
selectElementBtnAll.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectElement = btn.id;
    if (selectElement == "header") {
      if (textHeaderEl.classList.contains("hidden")) {
        managerSettingDeleteBtn.classList.add("disabled");
        managerSettingColorBtn.classList.add("disabled");
      } else {
        managerSettingDeleteBtn.classList.remove("disabled");
        managerSettingColorBtn.classList.remove("disabled");
      }
      textHeaderWrapperEl.scrollIntoView({ behavior: "smooth" });
    } else if (selectElement == "text") {
      if (textSecondaryEl.classList.contains("hidden")) {
        managerSettingDeleteBtn.classList.add("disabled");
        managerSettingColorBtn.classList.add("disabled");
      } else {
        managerSettingDeleteBtn.classList.remove("disabled");
        managerSettingColorBtn.classList.remove("disabled");
      }
      textHeaderWrapperEl.scrollIntoView({ behavior: "smooth" });
    }
    openPanelManageSetting();
  });
});

//Открываем панель настроек
settingOpen.addEventListener("click", openPanelSelectEl);

settingMenuCloseBtn.addEventListener("click", closePanelSetting);

managerSettingColorBtn.addEventListener("click", openPanelPalette);

managerSettingDeleteBtn.addEventListener("click", () => {
  if (selectElement == "header") {
    textHeaderEl.classList.add("hidden");
  } else if (selectElement == "text") {
    textSecondaryEl.classList.add("hidden");
  }
  previousSettings[selectElement].content = "";
  managerSettingDeleteBtn.classList.add("disabled");
  managerSettingColorBtn.classList.add("disabled");
});

settingMenuBackBtn.addEventListener("click", (event) => {
  if (activeMenu == "MANAGE_SETTING_MENU") {
    managerSettingBox.classList.add("hidden");
    selectElement = undefined;
    openPanelSelectEl();
    activeMenu = "PALETTE_MENU";
    settingMenuBackBtn.classList.add("hidden");
  }
});

//Открыть инпут для редактирования текста
managerSettingEditBtn.addEventListener("click", () => {
  editTextInput.value = previousSettings[selectElement].content;
  editTextBox.classList.remove("hidden");
  console.log("Открыть панель редактирования текста");
  activeMenu = "EDIT_TEXT_MENU";
  settingMenuBackBtn.classList.add("hidden");
  closePanelSetting();
  closePanelSelectEl();
  managerSettingBox.classList.add("hidden");
  settingOpen.classList.add("hidden");
});

//Редактирование в инпуте
editTextInput.addEventListener("input", (event) => {
  const newValue = event.target.value;
  const notEmpty = newValue.trim() !== "";
  if (selectElement == "header") {
    textHeaderEl.innerText = newValue;
    if (notEmpty) {
      textHeaderEl.classList.remove("hidden");
    } else {
      textHeaderEl.classList.add("hidden");
    }
  } else if (selectElement == "text") {
    textSecondaryEl.innerText = newValue;
    if (notEmpty) {
      textSecondaryEl.classList.remove("hidden");
    } else {
      textSecondaryEl.classList.add("hidden");
    }
  }
  if (newValue !== previousSettings[selectElement].content) {
    isChanges = true;
  }
  if (notEmpty) {
    managerSettingDeleteBtn.classList.remove("disabled");
    managerSettingColorBtn.classList.remove("disabled");
  } else {
    managerSettingDeleteBtn.classList.add("disabled");
    managerSettingColorBtn.classList.add("disabled");
  }
});

//Ограничение до 45 символов в инпуте
editTextInput.addEventListener("keydown", (event) => {
  // Разрешаем удаление и навигацию (Backspace, Delete, стрелки)
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
  if (editTextInput.value.length >= 45 && !allowedKeys.includes(event.key)) {
    event.preventDefault();
    editTextWarning.classList.remove("hidden");
  } else {
    editTextWarning.classList.add("hidden");
  }
});

//Отменить изменения в редактировании текста и закрыть инпут
editTextCloseBtn.addEventListener("click", () => {
  if (isChanges) {
    openPopup();
  } else {
    editTextBox.classList.add("hidden");
    managerSettingBox.classList.remove("hidden");
    activeMenu = "MANAGE_SETTING_MENU";
    settingMenuBackBtn.classList.remove("hidden");
    settingMenuEl.classList.remove("hidden");
  }
});

//Сохранить изменения в редактировании текста и закрыть инпут
editTextSaveBtn.addEventListener("click", () => {
  if (isChanges) {
    previousSettings[selectElement].content = editTextInput.value;
  }
  editTextBox.classList.add("hidden");
  managerSettingBox.classList.remove("hidden");
  activeMenu = "MANAGE_SETTING_MENU";
  settingMenuBackBtn.classList.remove("hidden");
  settingMenuEl.classList.remove("hidden");
});
