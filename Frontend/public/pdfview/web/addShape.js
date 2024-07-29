const addShapeBtn = document.getElementById("shape_format");
let isDrawingShape = false;
let shapeId = baseId;

const viewer = document.getElementById("viewer");
let isDrawing = false;
let startX = 0;
let startY = 0;
let rectElement;

let selectedShapeFillColor = 'white'; // Default no fill
let selectedShapeOutlineColor = 'black'; // Default black outline
let selectedTextColor = 'black'; // Default black text color
let selectedBorderRadius = 0; // Default no border radius
let selectedBorderWeight = 1;
let selectedTextSize = 16;

$(addShapeBtn).on("click", function () {
  $("#editorShapeFormatToolbar").toggleClass("hidden");
});

$(".shape-item").on("click", function () {
  baseId++;
  isDrawingShape = true;
  $("#editorShapeFormatToolbar").addClass("hidden");
  viewer.style.cursor = 'crosshair';
});

$(".drawing-color").on("click", function () {
  const color = $(this).attr("color");
  if ($(this).closest('#shape-fill-dropdown').length) {
    selectedShapeFillColor = color;
  } else if ($(this).closest('#shape-outline-dropdown').length) {
    selectedShapeOutlineColor = color;
  } else if ($(this).closest('#text-color-dropdown').length) {
    selectedTextColor = color;
  }
});

$(".size-dropdown input").on("input", function () {
  $(this).next('.range-value').remove();
  var type = $(this).parents(".size-dropdown").attr("type"); // border radius = 1, border width = 2, text size = 3;
  if (type === "1") {
    selectedBorderRadius = $(this).val();
    $(this).after(`<span class="range-value">${selectedBorderRadius}px</span>`);
  } else if (type === "2") {
    selectedBorderWeight = $(this).val();
    $(this).after(`<span class="range-value">${selectedBorderWeight}px</span>`);
  } else {
    selectedTextSize = $(this).val();
    $(this).after(`<span class="range-value">${selectedTextSize}px</span>`);
  }
});

const handleShape = function (w, h, canvasWidth, canvasHeight, shapeFillColor, borderColor, textColor, borderRadius, borderWidth, textSize, shapeText) {
  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      // form_storage[i].imgData = shapeImgData;
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
  if (count == shapeStorage.length || shapeStorage == null) {
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
      // canvasWidth: canvasWidth,
      // canvasHeight: canvasHeight,
      // imgData: shapeImgData,
      shapeFillColor: shapeFillColor,
      borderColor: borderColor,
      textColor: textColor,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      textSize: textSize,
      shapeText: shapeText
    });
  }
  const date = new Date(Date.now());
  addHistory(baseId, SHAPE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "shape");
};

viewer.addEventListener("mousedown", function (e) {
  if (!isDrawingShape) return;  
  
  const rect = viewer.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  
  isDrawing = true;
  viewer.style.cursor = 'auto';

  rectElement = document.createElement("div");
  rectElement.id = "shape" + baseId;
  rectElement.className = "shapeContainer form-fields";
  rectElement.style.display = "flex";
  rectElement.style.alignItems = "center";
  rectElement.style.justifyContent = "center";
  rectElement.style.position = "absolute";
  rectElement.style.left = `${startX}px`;
  rectElement.style.top = `${startY}px`;
  rectElement.style.border = `${selectedBorderWeight}px solid ${selectedShapeOutlineColor}`;
  rectElement.style.backgroundColor = selectedShapeFillColor;
  rectElement.style.borderRadius = `${selectedBorderRadius}px`;
  rectElement.style.fontSize = `${selectedTextSize}px`;
  viewer.appendChild(rectElement);
});

viewer.addEventListener("mousemove", function (e) {
  if (!isDrawing) return;

  const currentX = e.clientX - viewer.getBoundingClientRect().left;
  const currentY = e.clientY - viewer.getBoundingClientRect().top;
  const width = currentX - startX;
  const height = currentY - startY;

  rectElement.style.width = `${Math.abs(width)}px`;
  rectElement.style.height = `${Math.abs(height)}px`;

  rectElement.style.left = `${Math.min(currentX, startX)}px`;
  rectElement.style.top = `${Math.min(currentY, startY)}px`;
});

viewer.addEventListener("mouseup", function (e) {
  if (!isDrawing) return;
  
  viewer.style.cursor = 'auto';

  const rect = viewer.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;

  // Ensure the coordinates are from the top-left corner of the rectangle
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
  editableDiv.setAttribute("contenteditable", "true");
  editableDiv.style.position = "absolute";
  editableDiv.style.width = "100%";
  editableDiv.style.height = "fit-content";
  editableDiv.style.display = "flex";
  editableDiv.style.alignItems = "center";
  editableDiv.style.justifyContent = "center";
  editableDiv.style.textAlign = "center";
  editableDiv.style.fontSize = selectedTextSize;
  editableDiv.style.color = selectedTextColor;
  editableDiv.focus();

  rectElement.appendChild(editableDiv);
  editableDiv.focus();

  enableInteractJS(rectElement.id, SHAPE, baseId);

  editableDiv.addEventListener("blur", () => {
    const shapeText = editableDiv.innerHTML.trim();
    handleShape(
      parseInt(finalRect.width, 10),
      parseInt(finalRect.height, 10),
      viewer.clientWidth,
      viewer.clientHeight,
      selectedShapeFillColor,
      selectedShapeOutlineColor,
      selectedTextColor,
      selectedBorderRadius,
      selectedBorderWeight,
      selectedTextSize,
      shapeText
    );
  });

  editableDiv.addEventListener("dblclick", (event) => {
    current_shape_id = rectElement.id;
    showTextInput(event, rectElement, editableDiv);
  });
});


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
          const target = event.target;
          let x = (parseFloat(target.getAttribute("data-x")) || 0);
          let y = (parseFloat(target.getAttribute("data-y")) || 0);
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
          moveEventHandler(event, x, y, currentId);
        },
      },
      modifiers: [
        interact.modifiers.restrictEdges({ outer: "parent" }),
        interact.modifiers.restrictSize({ min: { width: 15, height: 15 } }),
      ],
      inertia: true,
      enabled: false // Initially disable resize
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
        end() {
          console.log("elementId************", elementId);
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
  });
}

viewer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("shapeContainer") && !e.target.classList.contains("resize-point")) {
    interact(".shapeContainer").resizable({ enabled: false });
  }
});

function drawShapeFromStorage(formItem) {
  const shapeContainer = document.getElementById(formItem.containerId);

  shapeContainer.style.backgroundColor = formItem.shapeFillColor;
  shapeContainer.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
  shapeContainer.style.borderRadius = `${formItem.borderRadius}px`;

  const editableDiv = shapeContainer.querySelector(".shapeText");
  editableDiv.innerHTML = formItem.shapeText;
  editableDiv.style.fontSize = `${formItem.textSize}px`;
  editableDiv.style.color = formItem.textColor;
  editableDiv.focus();

  editableDiv.addEventListener("dblclick", (event) => {
    current_shape_id = formItem.id;
    showTextInput(event, shapeContainer, editableDiv);
  });

  editableDiv.addEventListener("blur", () => {
    const shapeText = editableDiv.innerHTML.trim();
    formItem.shapeText = shapeText;
  });

  // addResizebar(formItem.containerId);  
  enableInteractJS(formItem.containerId, SHAPE, formItem.id);
  drawShapeStyle(formItem);
}

function updateText(editableDiv) {
  editableDiv.style.display = 'block';
  editableDiv.style.textAlign = 'center';
}

function saveText(editableDiv, shapeContainer) {
  updateText(editableDiv, shapeContainer);
  editableDiv.style.display = 'block';
  editableDiv.style.textAlign = 'center';
  shapeText = editableDiv.innerHTML.trim();
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
  $("#shape-fill-dropdown").find(".drawing-color").each(function(){
    if($(this).attr("color") == item.shapeFillColor){
      $(this).addClass("selected");
    }
  })
  $("#shape-outline-dropdown").find(".drawing-color").each(function(){
    if($(this).attr("color") == item.borderColor){
      $(this).addClass("selected");
    }
  })
  $("#text-color-dropdown").find(".drawing-color").each(function(){
    if($(this).attr("color") == item.textColor){
      $(this).addClass("selected");
    }
  })
  $("#border-radius-dropdown").find("input").val(item.borderRadius)
  $("#border-weight-dropdown").find("input").val(item.borderWidth)
  $("#text-size-dropdown").find("input").val(item.textSize)
}

$("#viewer").on("click", function (e) {
  if (isDraft === "true") {
    if (form_storage && form_storage !== null) {
        form_storage.forEach((formItem) => {
          if (formItem.form_type === SHAPE){
            drawShapeFromStorage(formItem);
            resizeCanvas(formItem.containerId, SIGNATURE, formItem.id);
          }
      })
    }
  }
});
