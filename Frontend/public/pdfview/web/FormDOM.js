const handleFormModeChange = () => {
  let checkbox = document.getElementById("add_form_check");
  let radio = document.getElementById("add_form_radio");
  let text = document.getElementById("add_form_text");
  let combo = document.getElementById("add_form_combo");
  let list = document.getElementById("add_form_list");
  let button = document.getElementById("add_form_button");
  let date = document.getElementById("add_form_date");
  let sign = document.getElementById("add_form_signature");
  if (isCheckbox) {
    checkbox.classList.add("active_menu");
  } else {
    checkbox.classList.remove("active_menu");
  }
  if (isRadioButton) {
    radio.classList.add("active_menu");
  } else {
    radio.classList.remove("active_menu");
  }
  if (isTextField) {
    text.classList.add("active_menu");
  } else {
    text.classList.remove("active_menu");
  }
  if (isCombo) {
    combo.classList.add("active_menu");
  } else {
    combo.classList.remove("active_menu");
  }
  if (isList) {
    list.classList.add("active_menu");
  } else {
    list.classList.remove("active_menu");
  }
  if (isButton) {
    button.classList.add("active_menu");
  } else {
    button.classList.remove("active_menu");
  }
  if (isDate) {
    date.classList.add("active_menu");
  } else {
    date.classList.remove("active_menu");
  }
  if (isSignature) {
    sign.classList.add("active_menu");
  } else {
    sign.classList.remove("active_menu");
  }
};

const addForm = function (mode) {
  currentMode = mode;
  switch (mode) {
    case CHECKBOX:
      if (isCheckbox) {
        removeEventListener();
        isCheckbox = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isCheckbox = true;
        handleFormModeChange();
      }
      break;
    case RADIO:
      if (isRadioButton) {
        removeEventListener();
        isRadioButton = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isRadioButton = true;
        handleFormModeChange();
      }
      break;
    case TEXTFIELD:
      if (isTextField) {
        removeEventListener();
        isTextField = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isTextField = true;
        handleFormModeChange();
      }
      break;
    case COMBOBOX:
      if (isCombo) {
        removeEventListener();
        isCombo = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isCombo = true;
        handleFormModeChange();
      }
      break;
    case LIST:
      if (isList) {
        removeEventListener();
        isList = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isList = true;
        handleFormModeChange();
      }
      break;
    case BUTTON:
      if (isButton) {
        removeEventListener();
        isButton = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isButton = true;
        handleFormModeChange();
      }
      break;
    case DATE:
      if (isDate) {
        removeEventListener();
        isDate = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isDate = true;
        handleFormModeChange();
      }
      break;
    case SIGNATURE:
      if (isSignature) {
        removeEventListener();
        isSignature = false;
        handleFormModeChange();
      } else {
        addEventListener();
        Format();
        isSignature = true;
        handleFormModeChange();
      }
      break;
    default:
      break;
  }
};

const addEventListener = function () {
  document.getElementById("viewer").addEventListener("click", eventHandler);
};

const removeEventListener = function () {
  document.getElementById("viewer").removeEventListener("click", eventHandler);
};

const removeCheckbox = function () {
  isCheckbox = false;
  removeEventListener();
  handleFormModeChange();
};
const removeRadio = function () {
  isRadioButton = false;
  removeEventListener();
  handleFormModeChange();
};
const removeText = function () {
  isTextField = false;
  removeEventListener();
  handleFormModeChange();
};
const removeCombo = function () {
  isCombo = false;
  removeEventListener();
  handleFormModeChange();
};
const removeList = function () {
  isList = false;
  removeEventListener();
  handleFormModeChange();
};
const removeButton = function () {
  isButton = false;
  removeEventListener();
  handleFormModeChange();
};
const removeDate = function () {
  isDate = false;
  removeEventListener();
  handleFormModeChange();
};
const removeSignature = function () {
  isSignature = false;
  removeEventListener();
  handleFormModeChange();
};

const Format = () => {
  isCheckbox = false;
  isRadioButton = false;
  isTextField = false;
  isCombo = false;
  isList = false;
  isButton = false;
  isDate = false;
  isSignature = false;
};
