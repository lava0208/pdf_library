let isDrawingShape = false;
let shapeId = baseId;

const viewer = document.getElementById("viewer");
let isDrawing = false;
let startX = 0;
let startY = 0;
let rectElement;
let shapeType = "shape";

let selectedShapeFillColor = 'white';
let selectedShapeOutlineColor = 'black';
let selectedTextColor = 'black';
let selectedBorderRadius = '0px';
let selectedBorderWeight = '1px';
let selectedTextSize = '16px';
let selectedTextBold = false;
let selectedTextItalic = false;
let selectedTextUnderline = false;

$("#shape_format").on("click", function () {
  $("#editorShapeFormatToolbar").toggleClass("hidden");

  initialShapeStyle()
});

$(".shape-item").on("click", function () {
  baseId++;
  shapeType = $(this).attr("type");
  isDrawingShape = true;
  $("#editorShapeFormatToolbar").addClass("hidden");
  viewer.style.cursor = 'crosshair';

  if (shapeType !== "shape") {
    selectedBorderRadius = "50%";
  }
});

$(".shape-colorpicker").on("change", function () {
  const color = $(this).val();
  if ($(this).closest('#shape-fill-dropdown').length) {
    selectedShapeFillColor = color;
  } else if ($(this).closest('#shape-outline-dropdown').length) {
    selectedShapeOutlineColor = color;
  } else if ($(this).closest('#text-color-dropdown').length) {
    selectedTextColor = color;
  }

  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeContainer.querySelector(".shapeText").innerHTML.trim();

  if ($(this).closest('#shape-fill-dropdown').length) {
    selectedShapeFillColor = color;
    shapeContainer.style.backgroundColor = color;
  } else if ($(this).closest('#shape-outline-dropdown').length) {
    selectedShapeOutlineColor = color;
    shapeContainer.style.borderColor = color;
  } else if ($(this).closest('#text-color-dropdown').length) {
    selectedTextColor = color;
    shapeText.style.color = color;
  }

  const finalRect = {
    left: shapeContainer.style.left,
    top: shapeContainer.style.top,
    width: shapeContainer.style.width,
    height: shapeContainer.style.height,
  };

  // if(isDraft === "true"){
    handleShape(
      selectedShapeFillColor,
      selectedShapeOutlineColor,
      selectedTextColor,
      selectedBorderRadius,
      selectedBorderWeight,
      selectedTextSize,
      selectedTextBold,
      selectedTextItalic,
      selectedTextUnderline,
      shapeTextHtml,
      parseInt(finalRect.width, 10),
      parseInt(finalRect.height, 10),
      viewer.clientWidth,
      viewer.clientHeight,
    );
  // }
});

$(".size-dropdown input").on("input", function () {
  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeContainer.querySelector(".shapeText").innerHTML.trim();

  var type = $(this).parents(".size-dropdown").attr("type");
  if (type === "1") {
    if(shapeType === "shape"){
      selectedBorderRadius = $(this).val() + "px";
      shapeContainer.style.borderRadius = `${selectedBorderRadius}`;
      $(this).parent().find(".range-value").html(selectedBorderRadius);
    }
  } else if (type === "2") {
    selectedBorderWeight = $(this).val() + "px";
    shapeContainer.style.borderWidth = `${selectedBorderWeight}`;
    shapeContainer.style.border = `${selectedBorderWeight} solid ${selectedShapeOutlineColor}`;
    $(this).parent().find(".range-value").html(selectedBorderWeight);
  } else {
    selectedTextSize = $(this).val() + "px";
    shapeText.style.fontSize = `${selectedTextSize}`;
    $(this).parent().find(".range-value").html(selectedTextSize);
  }

  const finalRect = {
    left: shapeContainer.style.left,
    top: shapeContainer.style.top,
    width: shapeContainer.style.width,
    height: shapeContainer.style.height,
  };

  handleShape(
    selectedShapeFillColor,
    selectedShapeOutlineColor,
    selectedTextColor,
    selectedBorderRadius,
    selectedBorderWeight,
    selectedTextSize,
    selectedTextBold,
    selectedTextItalic,
    selectedTextUnderline,
    shapeTextHtml,
    parseInt(finalRect.width, 10),
    parseInt(finalRect.height, 10),
    viewer.clientWidth,
    viewer.clientHeight,
  );
});

$("#extra-shape-icons i").on("click", function () {
  $(this).toggleClass("active");
  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeContainer.querySelector(".shapeText").innerHTML.trim();

  var id = $(this).attr("id");
  if (id === "text-bold") {
    selectedTextBold = !selectedTextBold;
    shapeText.style.fontWeight = selectedTextBold ? "bold" : "normal";
  } else if (id === "text-italic") {
    selectedTextItalic = !selectedTextItalic;
    shapeText.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  } else if (id === "text-underline") {
    selectedTextUnderline = !selectedTextUnderline;
    shapeText.style.textDecoration = selectedTextUnderline ? "underline" : "none";
  }

  const finalRect = {
    left: shapeContainer.style.left,
    top: shapeContainer.style.top,
    width: shapeContainer.style.width,
    height: shapeContainer.style.height,
  };

  handleShape(
    selectedShapeFillColor,
    selectedShapeOutlineColor,
    selectedTextColor,
    selectedBorderRadius,
    selectedBorderWeight,
    selectedTextSize,
    selectedTextBold,
    selectedTextItalic,
    selectedTextUnderline,
    shapeTextHtml,
    parseInt(finalRect.width, 10),
    parseInt(finalRect.height, 10),
    viewer.clientWidth,
    viewer.clientHeight,
  );
});

$("#closeShapeToolbar").on("click", function () {
  $("#shapeToolbar").hide();
  $("#viewerContainer").removeClass("withToolbar");
})

$(document).on("input", ".shapeText", function () {
  const shapeContainer = $(this).closest(".shapeContainer")[0];

  shapeContainer.style.backgroundColor = selectedShapeFillColor;
  shapeContainer.style.borderColor = selectedShapeOutlineColor;
  shapeContainer.style.borderRadius = `${selectedBorderRadius}`;
  shapeContainer.style.borderWidth = `${selectedBorderWeight}`;

  this.style.color = selectedTextColor;
  this.style.fontSize = `${selectedTextSize}`;
  this.style.fontWeight = selectedTextBold ? "bold" : "normal";
  this.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  this.style.textDecoration = selectedTextUnderline ? "underline" : "none";
});


viewer.addEventListener("mousedown", function (e) {
  if (!isDrawingShape) return;  
  
  const rect = viewer.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  
  isDrawing = true;
  viewer.style.cursor = 'auto';

  rectElement = document.createElement("div");
  rectElement.id = "shape" + baseId;
  rectElement.className = "shapeContainer form-fields active";
  rectElement.style.display = "flex";
  rectElement.style.alignItems = "center";
  rectElement.style.justifyContent = "center";
  rectElement.style.position = "absolute";
  rectElement.style.left = `${startX}px`;
  rectElement.style.top = `${startY}px`;
  rectElement.style.border = `${selectedBorderWeight} solid ${selectedShapeOutlineColor}`;
  rectElement.style.backgroundColor = selectedShapeFillColor;
  rectElement.style.borderRadius = `${selectedBorderRadius}`;
  rectElement.style.fontSize = `${selectedTextSize}`;
  rectElement.style.fontWeight = selectedTextBold ? "bold" : "normal";
  rectElement.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  rectElement.style.textDecoration = selectedTextUnderline ? "underline" : "none";

  if (shapeType === "circle") {
    rectElement.style.borderRadius = "50%";
  } else {
    rectElement.style.borderRadius = `${selectedBorderRadius}`;
  }

  viewer.appendChild(rectElement);
});

viewer.addEventListener("mousemove", function (e) {
  if (!isDrawing) return;

  const currentX = e.clientX - viewer.getBoundingClientRect().left;
  const currentY = e.clientY - viewer.getBoundingClientRect().top;
  const width = currentX - startX;
  const height = currentY - startY;

  if (shapeType === "circle") {
    const size = Math.max(Math.abs(width), Math.abs(height));
    rectElement.style.width = `${size}px`;
    rectElement.style.height = `${size}px`;
  } else {
    rectElement.style.width = `${Math.abs(width)}px`;
    rectElement.style.height = `${Math.abs(height)}px`;
  }

  rectElement.style.left = `${Math.min(currentX, startX)}px`;
  rectElement.style.top = `${Math.min(currentY, startY)}px`;
});

viewer.addEventListener("mouseup", function (e) {
  if (!isDrawing) return;
  initialShapeStyle();

  viewer.style.cursor = 'auto';

  const rect = viewer.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);

  let ost = computePageOffset();
  let x = left + rect.left - ost.left;
  let y = top + rect.top - ost.top;

  let pageId = String(PDFViewerApplication.page);
  let pg = document.getElementById(pageId);

  let shape_x_y = PDFViewerApplication.pdfViewer._pages[
    PDFViewerApplication.page - 1
  ].viewport.convertToPdfPoint(x, y);

  pos_x_pdf = shape_x_y[0];
  pos_y_pdf = shape_x_y[1];

  isDrawing = false;
  isDrawingShape = false;
  current_form_id = baseId;

  plot.initStore();

  const finalRect = {
    left: rectElement.style.left,
    top: rectElement.style.top,
    width: rectElement.style.width,
    height: rectElement.style.height,
  };

  const editableDiv = document.createElement("div");
  editableDiv.className = "shapeText";
  editableDiv.setAttribute("contenteditable", "false");
  editableDiv.style.position = "absolute";
  editableDiv.style.width = "100%";
  editableDiv.style.height = "fit-content";
  editableDiv.style.display = "flex";
  editableDiv.style.alignItems = "center";
  editableDiv.style.justifyContent = "center";
  editableDiv.style.textAlign = "center";
  editableDiv.style.color = selectedTextColor;
  editableDiv.style.fontSize = selectedTextSize;
  editableDiv.style.fontWeight = selectedTextBold ? "bold" : "normal";
  editableDiv.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  editableDiv.style.textDecoration = selectedTextUnderline ? "underline " : "";

  rectElement.appendChild(editableDiv);

  enableInteractJS(rectElement.id, SHAPE, baseId);

  $("#shapeToolbar").css("display", "flex");
  $("#viewerContainer").addClass("withToolbar");

  editableDiv.addEventListener("blur", () => {
    const shapeText = editableDiv.innerHTML.trim();
    handleShape(
      selectedShapeFillColor,
      selectedShapeOutlineColor,
      selectedTextColor,
      selectedBorderRadius,
      selectedBorderWeight,
      selectedTextSize,
      selectedTextBold,
      selectedTextItalic,
      selectedTextUnderline,
      shapeText,
      parseInt(finalRect.width, 10),
      parseInt(finalRect.height, 10),
      viewer.clientWidth,
      viewer.clientHeight,
    );
    editableDiv.setAttribute("contenteditable", "false");
  });
})

viewer.addEventListener("click", function (e) {
  if (isDraft !== "false") {
    if (form_storage && form_storage !== null) {
        form_storage.forEach((formItem) => {
          if (formItem.form_type === SHAPE){
            if (formItem.id == current_form_id) {
              drawShapeFromStorage(formItem);
            }
            resizeCanvas(formItem.containerId, SHAPE, formItem.id);
          }
      })
    }
    if (!e.target.classList.contains("shapeContainer") && !e.target.closest(".shapeContainer")) {
      document.querySelectorAll(".shapeText").forEach(shapeText => {
        shapeText.setAttribute("contenteditable", "false");
        shapeText.blur();
      });
      $("#shapeToolbar").hide();
      $("#viewerContainer").removeClass("withToolbar");
      $(".shapeContainer.active").removeClass("active");
    }
  }else{
    document.querySelectorAll(".shapeText").forEach(shapeText => {
      shapeText.setAttribute("contenteditable", "false");
    });
  }
});

viewer.addEventListener("dblclick", function (e) {
  if(isDraft !== "false"){
    if (e.target.classList.contains("shapeContainer") || e.target.closest(".shapeContainer")) {
      $("#shapeToolbar").css("display", "flex");
      $("#viewerContainer").addClass("withToolbar");
  
      const shapeContainer = e.target.closest(".shapeContainer");
      $(".shapeContainer").removeClass("active");
      $(shapeContainer).addClass("active");
      
      const shapeText = shapeContainer.querySelector(".shapeText");

      $("#shape-fill-dropdown").find("input").val(rgbToHex(shapeContainer.style.backgroundColor));
      $("#shape-outline-dropdown").find("input").val(rgbToHex(shapeContainer.style.borderColor));
      $("#text-color-dropdown").find("input").val(rgbToHex(shapeText.style.color));
  
      if(shapeType === "shape"){
        $("#border-radius-dropdown input").val(parseInt(shapeContainer.style.borderRadius));
        $("#border-radius-dropdown .range-value").text(shapeContainer.style.borderRadius);
      }else{
        $("#border-radius-dropdown input").val(0);
      }
      $("#border-weight-dropdown input").val(parseInt(shapeContainer.style.borderWidth));      
      $("#text-size-dropdown input").val(parseInt(shapeText.style.fontSize));

      $("#border-weight-dropdown .range-value").text(shapeContainer.style.borderWidth);
      $("#text-size-dropdown .range-value").text(shapeText.style.fontSize);
  
      if (shapeText.style.fontWeight === "bold") {
        $("#text-bold").addClass("active");
      } else {
        $("#text-bold").removeClass("active");
      }
  
      if (shapeText.style.fontStyle === "italic") {
        $("#text-italic").addClass("active");
      } else {
        $("#text-italic").removeClass("active");
      }
  
      if (shapeText.style.textDecoration.includes("underline")) {
        $("#text-underline").addClass("active");
      } else {
        $("#text-underline").removeClass("active");
      }
  
      selectedShapeFillColor = shapeContainer.style.backgroundColor;
      selectedShapeOutlineColor = shapeContainer.style.borderColor;
      selectedBorderRadius = shapeContainer.style.borderRadius;
      selectedBorderWeight = shapeContainer.style.borderWidth;
      selectedTextColor = shapeText.style.color;
      selectedTextSize = shapeText.style.fontSize;
      selectedTextBold = shapeText.style.fontWeight === "bold" ? true : false;
      selectedTextItalic = shapeText.style.fontStyle === "italic" ? true : false;
      selectedTextUnderline = shapeText.style.textDecoration === "underline" ? true : false;

      //... add delete button
      const sId = shapeContainer.id.replace("shape", "");
      current_form_id = sId;

      let istooltipshow = false;
      if (
        document.getElementById("shape_tooltipbar" + current_form_id)
      ) {
        istooltipshow = true;
      }
      
      if (isDragging) {
        isDragging = false;
      } else {
        if (!istooltipshow) {
          let tooltipbar = document.createElement("div");
          addDeleteButton(
            current_form_id,
            tooltipbar,
            shapeContainer,
            "shape"
          );
        } else {
          document
            .getElementById("shape_tooltipbar" + current_shape_id)
            .remove();
        }
      }
    }
  }
});

function initialShapeStyle(){
  // Initialize the styles of editorShapeFormatToolbar
  $("#shape-fill-dropdown").find("input").val("#FFFFFF");
  $("#shape-outline-dropdown").find("input").val("#000000");
  $("#text-color-dropdown").find("input").val("#000000");
  $("#border-radius-dropdown input").val(0);
  $("#border-weight-dropdown input").val(1);
  $("#text-size-dropdown input").val(16);
  $("#text-bold").removeClass("active");
  $("#text-italic").removeClass("active");
  $("#text-underline").removeClass("active");

  // Set default values
  selectedShapeFillColor = 'white';
  selectedShapeOutlineColor = 'black';
  selectedTextColor = 'black';
  selectedBorderRadius = '0px';
  selectedBorderWeight = '1px';
  selectedTextSize = '16px';
  selectedTextBold = false;
  selectedTextItalic = false;
  selectedTextUnderline = false;
}

function handleShape(shapeFillColor, borderColor, textColor, borderRadius, borderWidth, textSize, textBold, textItalic, textUnderline, shapeText, w, h, canvasWidth, canvasHeight) {
  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      
      form_storage[i].shapeFillColor = shapeFillColor;
      form_storage[i].borderColor = borderColor;
      form_storage[i].textColor = textColor;
      form_storage[i].borderRadius = borderRadius;
      form_storage[i].borderWidth = borderWidth;
      form_storage[i].textSize = textSize;
      form_storage[i].textBold = textBold;
      form_storage[i].textItalic = textItalic;
      form_storage[i].textUnderline = textUnderline;
      form_storage[i].shapeText = shapeText;
      return;
    }
  }
  formWidth = w;
  formHeight = h;
  let shapeStorage = form_storage.filter(function (item) {
    return item.form_type == SHAPE;
  });
  let count = 0;
  for (let j = 0; j < shapeStorage.length; j++) {
    if (form_storage[j].id != current_form_id)
      count++;
  }
  if (baseId !== 0 && count == shapeStorage.length) {
    form_storage.push({
      id: baseId,
      containerId: "shape" + baseId,
      form_type: SHAPE,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf - 7,
      y: pos_y_pdf + 7.5,
      baseX: pos_x_pdf - 7,
      baseY: pos_y_pdf + 7.5,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      shapeFillColor: shapeFillColor,
      borderColor: borderColor,
      textColor: textColor,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      textSize: textSize,
      textBold: textBold,
      textItalic: textItalic,
      textUnderline: textUnderline,
      shapeText: shapeText
    });
  }
  const date = new Date(Date.now());
  addHistory(baseId, SHAPE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "shape");
};

function enableInteractJS(elementId, type, currentId) {
  const element = document.getElementById(elementId);

  interact(`#${elementId}`)
    .resizable({
      edges: { left: ".resize-l", right: ".resize-r", bottom: ".resize-b", top: ".resize-t" },
      listeners: {
        move(event) {
          const target = event.target;
          let x = (parseFloat(target.getAttribute("data-x")) || 0);
          let y = (parseFloat(target.getAttribute("data-y")) || 0);
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          target.style.width = `${event.rect.width}px`;
          target.style.height = `${event.rect.height}px`;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
          resizeHandler(event.rect.width, event.rect.height, currentId);
        },
        end(event) {
          console.log(event);
        },
      },
      modifiers: [
        interact.modifiers.restrictEdges({ outer: "parent" }),
        interact.modifiers.restrictSize({ min: { width: 15, height: 15 } }),
      ],
      inertia: true,
      enabled: false
    })
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
        end(event) {
          const target = event.target;
          const shapeText = target.querySelector(".shapeText").innerHTML.trim();
          handleShape(
            target.style.backgroundColor,
            target.style.borderColor,
            target.querySelector(".shapeText").style.color,
            target.style.borderRadius,
            target.style.borderWidth,
            target.querySelector(".shapeText").style.fontSize,
            target.querySelector(".shapeText").style.fontWeight === "bold",
            target.querySelector(".shapeText").style.fontStyle === "italic",
            target.querySelector(".shapeText").style.textDecoration.includes("underline"),
            shapeText,
            parseInt(target.style.width, 10),
            parseInt(target.style.height, 10),
            viewer.clientWidth,
            viewer.clientHeight,
          );
        },
      },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
    });

  element.addEventListener("click", function (e) {
    interact(`#${elementId}`).resizable({ enabled: true });
    const shapeText = element.querySelector(".shapeText");
    if (shapeText && isDraft !== "false") {
      shapeText.setAttribute("contenteditable", "true");
    }
  });
}

function drawShapeFromStorage(formItem) {  
  const shapeContainer = document.getElementById(formItem.containerId);

  shapeContainer.style.backgroundColor = formItem.shapeFillColor;
  shapeContainer.style.border = `${formItem.borderWidth} solid ${formItem.borderColor}`;
  shapeContainer.style.borderRadius = `${formItem.borderRadius}`;

  const editableDiv = shapeContainer.querySelector(".shapeText");
  editableDiv.innerHTML = formItem.shapeText;
  editableDiv.style.color = formItem.textColor;
  editableDiv.style.fontSize = formItem.textSize;
  editableDiv.style.fontWeight = formItem.textBold ? "bold" : "normal";
  editableDiv.style.fontStyle = formItem.textItalic ? "italic" : "normal";
  editableDiv.style.textDecoration = formItem.textUnderline ? "underline " : "";
  // editableDiv.focus();

  editableDiv.addEventListener("dblclick", (event) => {
    // current_form_id = formItem.id;
    showTextInput(event, shapeContainer, editableDiv);
  });

  editableDiv.addEventListener("blur", () => {
    const shapeText = editableDiv.innerHTML.trim();
    formItem.shapeText = shapeText;
  });

  drawShapeStyle(formItem);
  enableInteractJS(formItem.containerId, SHAPE, formItem.id);  
}

function updateText(editableDiv) {
  editableDiv.style.display = 'block';
  editableDiv.style.textAlign = 'center';
  editableDiv.style.fontWeight = selectedTextBold ? "bold" : "normal";
  editableDiv.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  editableDiv.style.textDecoration = selectedTextUnderline ? "underline" : "none";
  editableDiv.style.fontSize = selectedTextSize;
  editableDiv.style.color = selectedTextColor;
}

function saveText(editableDiv, shapeContainer) {
  updateText(editableDiv, shapeContainer);
  editableDiv.style.display = 'block';
  editableDiv.style.textAlign = 'center';
  editableDiv.style.fontWeight = selectedTextBold ? "bold" : "normal";
  editableDiv.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  editableDiv.style.textDecoration = selectedTextUnderline ? "underline" : "none";
  editableDiv.style.fontSize = selectedTextSize;
  editableDiv.style.color = selectedTextColor;
  shapeText = editableDiv.innerHTML.trim();

  const finalRect = {
    left: shapeContainer.style.left,
    top: shapeContainer.style.top,
    width: shapeContainer.style.width,
    height: shapeContainer.style.height,
  };

  handleShape(
    selectedShapeFillColor,
    selectedShapeOutlineColor,
    selectedTextColor,
    selectedBorderRadius,
    selectedBorderWeight,
    selectedTextSize,
    selectedTextBold,
    selectedTextItalic,
    selectedTextUnderline,
    shapeText,
    parseInt(finalRect.width, 10),
    parseInt(finalRect.height, 10),
    viewer.clientWidth,
    viewer.clientHeight,
  );
}

function showTextInput(event, shapeContainer, editableDiv) {
  editableDiv.style.display = 'block';
  editableDiv.style.left = '50%';
  editableDiv.style.top = '50%';
  editableDiv.style.width = '90%';
  editableDiv.style.height = 'fit-content';
  editableDiv.style.minHeight = 'auto';
  editableDiv.style.transform = 'translate(-50%, -50%)';
  editableDiv.focus();

  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  if (range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  editableDiv.addEventListener('blur', () => saveText(editableDiv, shapeContainer), { once: true });
  editableDiv.addEventListener('input', () => updateText(editableDiv, shapeContainer));
}

function drawShapeStyle(item){
  $("#shape-fill-dropdown").find("input").val(item.shapeFillColor);
  $("#shape-outline-dropdown").find("input").val(item.borderColor);
  $("#text-color-dropdown").find("input").val(item.textColor);
  $("#border-radius-dropdown").find("input").val(parseInt(item.borderRadius));
  $("#border-weight-dropdown").find("input").val(parseInt(item.borderWidth));
  $("#text-size-dropdown").find("input").val(parseInt(item.textSize));
  if(item.textBold){
    $("#text-bold").addClass("active");
  }
  if(item.textItalic){
    $("#text-italic").addClass("active");
  }
  if(item.textUnderline){
    $("#text-underline").addClass("active");
  }
}

function rgbToHex(rgb) {
  const rgbArray = rgb.match(/\d+/g);
  const hex = rgbArray.map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
  return `#${hex}`;
}