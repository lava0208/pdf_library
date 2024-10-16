class GridColorPicker {
  constructor(input, options = {}) {
    this.name = "GridColorPicker";
    this.selector = "gcp";
    this.components = {
      input: input,
      inputAutocomplete: null,
      modal: {
        id: null,
        element: null,
        container: null,
      },
    };
    this.input = input;

    const defaultOptions = {
      selectType: "hex",
      mainColors: colorsPalette.main,
      othersColors: colorsPalette.others,
      animation: "none",
      itemsPerRow: 8,
      defaultColor: null,
      callback: null,
      autoOpen: false,
    };
    const {
      selectType,
      mainColors,
      othersColors,
      animation,
      itemsPerRow,
      defaultColor,
      callback,
      autoOpen,
    } = { ...defaultOptions, ...options };
    this.selectType = this.#validateColorFormat(selectType);
    this.mainColors = Array.isArray(mainColors)
      ? mainColors
      : defaultOptions.mainColors;
    this.othersColors = Array.isArray(othersColors)
      ? othersColors
      : defaultOptions.othersColors;
    this.animation = this.#validateAnimationType(animation);
    this.itemsPerRow =
      Number.isInteger(itemsPerRow) && itemsPerRow > 0
        ? itemsPerRow
        : defaultOptions.itemsPerRow;
    this.defaultColor =
      this.#detectColorFormat(defaultColor) !== "Unknown format"
        ? defaultColor
        : null;
    this.callback =
      typeof callback === "function" ? callback : defaultOptions.callback;
    this.autoOpen =
      typeof autoOpen === "boolean" ? autoOpen : defaultOptions.autoOpen;

    this.isModalOpen = false;

    this.#init();
  }

  open() {
    this.components.modal.element.classList.add("open");
    this.isModalOpen = true;

    this.#trapFocus();
  }

  isOpen() {
    return this.isModalOpen;
  }

  close() {
    this.components.modal.element.classList.add("close");
    this.components.modal.element.classList.remove("open");
    setTimeout(() => {
      this.components.modal.element.classList.remove("close");
    }, 300);

    this.isModalOpen = false;
    this.components.inputAutocomplete.focus();
  }

  #validateColorFormat(colorFormat) {
    const validFormats = ["hex", "rgb", "rgba"];
    if (colorFormat && validFormats.includes(colorFormat)) {
      return colorFormat;
    }
    return null;
  }

  #validateAnimationType(animation) {
    const validAnimations = ["none", "slide", "fade"];
    if (validAnimations.includes(animation)) {
      return animation;
    }
    return "none";
  }

  #init() {
    if (!this.input) {
      console.error("Element GridColorPicker not found");
      return;
    }

    this.#createId();
    this.#convertInputToHidden();
    this.#createModal();
  }

  #createId() {
    let tmpId = `${this.selector}-${(
      Math.random().toString(36) + "000000000"
    ).slice(2, 10)}`;
    this.components.modal.id = tmpId;
  }

  #convertInputToHidden() {
    const input = this.input;
    input.type = "hidden";

    const wrapper = document.createElement("div");
    wrapper.classList.add(`${this.selector}-autocomplete-wrapper`);

    const inputAutocomplete = document.createElement("input");
    inputAutocomplete.type = "text";
    inputAutocomplete.id = input.id + "_autocomplete";
    inputAutocomplete.className = input.className;

    wrapper.appendChild(inputAutocomplete);

    input.insertAdjacentElement("afterend", wrapper);
    this.components.inputAutocomplete = inputAutocomplete;

    this.#addColorFromInitValue();
  }

  async #addColorFromInitValue() {
    const valueID = this.input.value;

    if (!valueID && !this.defaultColor) {
      return;
    }
    this.#addColorBoxToInput(this.defaultColor, valueID);
  }

  #createModal() {
    const node = document.createElement("div");
    node.id = this.components.modal.id;
    node.classList.add(this.selector);
    node.style.position = "absolute";
    if (/^(slide|fade)$/.test(this.animation)) {
      node.classList.add(this.animation);
    }
    node.style.zIndex = 9999;
    node.role = "dialog";
    node.tabIndex = -1;

    const container = document.createElement("div");
    container.classList.add(`${this.selector}-container`, "fs-xs");

    node.appendChild(container);

    this.components.inputAutocomplete.parentElement.appendChild(node);

    this.components.modal.element = node;
    this.components.modal.container = container;

    this.#addOpenListener();
    this.#addCloseListener();

    this.#renderBody();

    if (this.autoOpen) {
      this.open();
    }
  }

  #addOpenListener() {
    this.components.inputAutocomplete.addEventListener("click", () => {
      if (!this.isModalOpen) {
        this.open();
      }
    });
  }

  #addCloseListener() {
    document.addEventListener("click", (event) => {
      if (
        !this?.components?.modal?.element?.contains(event.target) &&
        !this?.components?.inputAutocomplete?.contains(event.target) &&
        this.isModalOpen
      ) {
        this.close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isModalOpen) {
        this.close();
      }
    });
  }

  #trapFocus() {
    const focusableElementsString =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
    const focusableElements = this.components.modal.element.querySelectorAll(
      focusableElementsString
    );
    let firstFocusableElement = focusableElements[0];

    let currentFocusIndex = 0;
    firstFocusableElement.focus();
    this.#addArrowNavigation(focusableElements, currentFocusIndex);
  }

  #addArrowNavigation(focusableElements, currentFocusIndex) {
    this.components.modal.element.addEventListener("keydown", (e) => {
      if (!this.isModalOpen) return;

      const isTabPressed = e.key === "Tab" || e.keyCode === 9;
      const isArrowKey = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ].includes(e.key);
      if (!isArrowKey) return;

      e.preventDefault();

      const columns = this.itemsPerRow;
      console.log({ focusableElements, currentFocusIndex });
      if (e.key === "ArrowRight" || isTabPressed) {
        currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
      } else if (e.key === "ArrowLeft") {
        currentFocusIndex =
          (currentFocusIndex - 1 + focusableElements.length) %
          focusableElements.length;
      } else if (e.key === "ArrowDown") {
        currentFocusIndex =
          (currentFocusIndex + columns) % focusableElements.length;
      } else if (e.key === "ArrowUp") {
        currentFocusIndex =
          (currentFocusIndex - columns + focusableElements.length) %
          focusableElements.length;
      }

      focusableElements[currentFocusIndex].focus();
    });
  }

  #renderBody() {
    const lastTbody = document
      .getElementById(this.components.modal.id)
      .querySelector(`${this.selector}-palette`);
    if (lastTbody) {
      return;
    }

    const colorPaletteWrapper = document.createElement("div");
    colorPaletteWrapper.classList.add(`${this.selector}-palette`);

    const topColors = document.createElement("div");
    topColors.classList.add(`${this.selector}-top-colors`);
    colorPaletteWrapper.appendChild(topColors);

    const gridColors = document.createElement("div");
    gridColors.classList.add(`${this.selector}-grid-colors`);
    colorPaletteWrapper.appendChild(gridColors);

    this.#renderColorGroups(this.mainColors, topColors, `${this.selector}-row`);

    this.#renderColorGroups(
      this.othersColors,
      gridColors,
      `${this.selector}-row`
    );

    this.components.modal.container.appendChild(colorPaletteWrapper);
  }

  #renderColorGroups(colors, parentElement, rowClass) {
    let colorRow;
    colors.forEach((color, index) => {
      if (index % this.itemsPerRow === 0) {
        colorRow = document.createElement("div");
        colorRow.classList.add(rowClass);
        parentElement.appendChild(colorRow);
      }

      const colorWrapper = document.createElement("div");
      colorWrapper.classList.add(`${this.selector}-box`);
      colorWrapper.setAttribute("data-color", color);

      const colorNode = document.createElement("button");
      colorNode.classList.add(`${this.selector}-box-color`);
      colorNode.style.backgroundColor = color;

      colorNode.setAttribute("tabindex", "0");

      colorNode.addEventListener("click", () => {
        this.#addColorBoxToInput(color);
        this.close();
      });

      colorWrapper.appendChild(colorNode);
      colorRow.appendChild(colorWrapper);
    });
  }

  #addColorBoxToInput(defaultColor, inoutValueColor) {
    let color = null;

    if (defaultColor) {
      const isColor =
        this.#detectColorFormat(defaultColor) !== "Unknown format";
      color = isColor ? defaultColor : null;
    }

    if (!color && inoutValueColor) {
      const isColor =
        this.#detectColorFormat(inoutValueColor) !== "Unknown format";
      color = isColor ? inoutValueColor : null;
    }

    const colorFormated = this.#convertColor(color, this.selectType);

    this.components.input.value = this.components.inputAutocomplete.value =
      colorFormated;

    const wrapper = this.components.inputAutocomplete;

    wrapper.style.backgroundColor = colorFormated;
    wrapper.style.color = "transparent";

    const findActive = document.querySelectorAll(
      `.${this.selector}-box.active`
    );
    if (findActive) {
      findActive.forEach((item) => {
        item.classList.remove("active");
      });
    }

    const findDataColor = document.querySelectorAll(`[data-color="${color}"]`);
    if (findDataColor) {
      findDataColor.forEach((item) => {
        item.classList.add("active");
      });
    }

    if (typeof this.callback === "function") {
      this.callback(colorFormated);
    }
  }

  #detectColorFormat(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\((\s*\d{1,3}\s*,){2}\s*\d{1,3}\s*\)$/;
    const rgbaRegex = /^rgba\((\s*\d{1,3}\s*,){3}\s*(0|1|0?\.\d+)\s*\)$/;

    if (hexRegex.test(color)) {
      return "HEX";
    } else if (rgbRegex.test(color)) {
      return "RGB";
    } else if (rgbaRegex.test(color)) {
      return "RGBA";
    } else {
      return "Unknown format";
    }
  }

  #hexToRgb(hex) {
    let r, g, b;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  #rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    const r = parseInt(rgbValues[0]).toString(16).padStart(2, "0");
    const g = parseInt(rgbValues[1]).toString(16).padStart(2, "0");
    const b = parseInt(rgbValues[2]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  #rgbToRgba(rgb, alpha = 1) {
    const rgbValues = rgb.match(/\d+/g);
    return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
  }

  #rgbaToRgb(rgba) {
    const rgbaValues = rgba.match(/\d+/g);
    return `rgb(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]})`;
  }

  #hexToRgba(hex, alpha = 1) {
    const rgbColor = this.#hexToRgb(hex);
    return this.#rgbToRgba(rgbColor, alpha);
  }

  #convertColor(color, targetFormat, alpha = 1) {
    const currentFormat = this.#detectColorFormat(color);

    if (currentFormat === "Unknown format") {
      return "Invalid color format";
    }

    targetFormat = targetFormat.toUpperCase();

    if (currentFormat === targetFormat) {
      return color;
    }

    switch (currentFormat) {
      case "HEX":
        if (targetFormat === "RGB") {
          return this.#hexToRgb(color);
        } else if (targetFormat === "RGBA") {
          return this.#hexToRgba(color, alpha);
        }
        break;
      case "RGB":
        if (targetFormat === "HEX") {
          return this.#rgbToHex(color);
        } else if (targetFormat === "RGBA") {
          return this.#rgbToRgba(color, alpha);
        }
        break;
      case "RGBA":
        if (targetFormat === "RGB") {
          return this.#rgbaToRgb(color);
        } else if (targetFormat === "HEX") {
          return this.#rgbToHex(this.#rgbaToRgb(color));
        }
        break;
    }
    return "Conversion not supported";
  }
}

const colorsPalette = {
  main: [
    "#ff0000",
    "#ff6600",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#ff00ff",
    "#ffffff",
  ],
  others: [
    "#ffcccc",
    "#ffcc99",
    "#ffffcc",
    "#ccffcc",
    "#ccffff",
    "#ccccff",
    "#ffccff",
    "#f8f9fa",

    "#ff9999",
    "#ffcc66",
    "#ffff99",
    "#99ff99",
    "#99ffff",
    "#9999ff",
    "#ff99ff",
    "#e9ecef",

    "#ff6666",
    "#ff9933",
    "#ffff66",
    "#66ff66",
    "#66ffff",
    "#6666ff",
    "#ff66ff",
    "#dee2e6",

    "#ff3333",
    "#ff6633",
    "#ffff33",
    "#33ff33",
    "#33ffff",
    "#3333ff",
    "#ff33ff",
    "#adb5bd",

    "#ff0000",
    "#ff6600",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#ff00ff",
    "#000000",

    "#cc0000",
    "#cc6600",
    "#cccc00",
    "#00cc00",
    "#00cccc",
    "#0000cc",
    "#cc00cc",
    "#495057",

    "#990000",
    "#994c00",
    "#999900",
    "#009900",
    "#009999",
    "#000099",
    "#990099",
    "#6c757d",

    "#660000",
    "#663300",
    "#666600",
    "#006600",
    "#006666",
    "#000066",
    "#660066",
    "#343a40",
  ],
};
