let shapeId = baseId;

const viewer = document.getElementById("viewer");
let isDrawing = false;
let startX = 0;
let startY = 0;
let rectElement;
let shapeType = "shape";

let selectedShapeFillColor = 'rgb(255, 255, 255)';
let selectedShapeOutlineColor = 'rgb(0, 0, 0)';
let selectedTextColor = 'rgb(0, 0, 0)';
let selectedBorderRadius = '0px';
let selectedBorderWeight = '1px';
let selectedTextSize = '16px';
let selectedTextBold = false;
let selectedTextItalic = false;
let selectedTextUnderline = false;
let selectedTextFamily = 'Courier';
let selectedTextAlign = shapeType === "circle" ? 'middle,center' : 'top,left';
let selectedListType = 'numeric';
let listCounter = 1;

$(".shape-item").on("click", function () {
  baseId++;
  shapeType = $(this).attr("type");
  isDrawingShape = true;
  viewer.style.cursor = 'crosshair';
  isTextModeOn = false;
  isAddCommentModeOn = false;

  if (shapeType === "circle") {
    selectedBorderRadius = "50%";
    selectedTextAlign = 'middle,center';
  } else if(shapeType === "shape") {
    selectedBorderRadius = "0px";
    selectedTextAlign = 'top,left';
  }

  $(".tabitem").removeClass("active_menu");
  $(this).addClass("active_menu");
  $("#shapeTypeToolbar").addClass("hidden");
  $("#viewerContainer").removeClass("withToolbar");
});

$(".shape-colorpicker").on("change", function () {
  // if($(this).parent().attr("type") !== "text"){
    saveShapeColorStyle($(this));
  // }
});

$(".shape-save").on("click", function () {
  // if($(this).parent().attr("type") !== "text"){
    saveShapeColorStyle($(this).parent().find(".shape-colorpicker").val())
  // }
});

$(".size-dropdown input").on("input", function () {
  const shapeContainer = document.querySelector(".shapeContainer.active");

  if (!shapeContainer) return;

  const shapeText = shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeText ? shapeText.innerHTML.trim() : "";

  selectedShapeOutlineColor = shapeContainer.style.borderBottomColor;

  const type = $(this).parents(".size-dropdown").attr("type");

  if (type === "1") {
    selectedBorderRadius = $(this).val() + "px";
    shapeContainer.style.borderRadius = `${selectedBorderRadius}`;
    $(this).parent().find(".range-value").html(selectedBorderRadius);
  } else if (type === "2") {
    selectedBorderWeight = $(this).val() + "px";
    shapeContainer.style.borderWidth = `${selectedBorderWeight}`;
    
    if (shapeType !== "line") {
      shapeContainer.style.border = `${selectedBorderWeight} solid ${selectedShapeOutlineColor}`;
    } else {
      shapeContainer.style.borderBottom = `${selectedBorderWeight} solid ${selectedShapeOutlineColor}`;
    }

    $(this).parent().find(".range-value").html(selectedBorderWeight);
  } else {
    if (shapeText) {
      selectedTextSize = $(this).val() + "px";
      shapeText.style.fontSize = `${selectedTextSize}`;
      $(this).parent().find(".range-value").html(selectedTextSize);
    }
  }

  if (shapeTextHtml || shapeType === "line") {
    drawShape(shapeContainer, shapeTextHtml);
  }
});

$("#extra-shape-icons i").on("click", function () {
  $(this).toggleClass("active");
  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeContainer.querySelector(".shapeText").innerHTML.trim();

  var id = $(this).attr("id");
  if (id === "shape-text-bold") {
    selectedTextBold = !selectedTextBold;
    shapeText.style.fontWeight = selectedTextBold ? "bold" : "normal";
  } else if (id === "shape-text-italic") {
    selectedTextItalic = !selectedTextItalic;
    shapeText.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  } else if (id === "shape-text-underline") {
    selectedTextUnderline = !selectedTextUnderline;
    shapeText.style.textDecoration = selectedTextUnderline ? "underline" : "none";
  }

  drawShape(shapeContainer, shapeTextHtml);
});

$("#text-family-dropdown .font-family-container").on("click", function () {
  $(".font-family-container").removeClass("active");
  $(this).toggleClass("active");

  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeContainer.querySelector(".shapeText").innerHTML.trim();

  if ($(this).hasClass("active")) {
    selectedTextFamily = $(this).attr("family");
    shapeText.style.fontFamily = selectedTextFamily;
  } else {
    selectedTextFamily = "";
    shapeText.style.fontFamily = "";
  }

  drawShape(shapeContainer, shapeTextHtml);
});

$("#text-align-dropdown .flex-container").on("click", function () {
  const selectedType = $(this).attr("type");

  if (selectedType === "horizontal") {
    $("#text-align-dropdown .flex-container[type='horizontal']").removeClass("active");
    $(this).toggleClass("active");
  }

  if (selectedType === "vertical") {
    $("#text-align-dropdown .flex-container[type='vertical']").removeClass("active");
    $(this).toggleClass("active");
  }

  const horizontalAlign = $("#text-align-dropdown .flex-container[type='horizontal'].active").attr("direction");
  const verticalAlign = $("#text-align-dropdown .flex-container[type='vertical'].active").attr("direction");

  selectedTextAlign = `${verticalAlign || ''}, ${horizontalAlign || ''}`.trim();

  const shapeContainer = document.querySelector(".shapeContainer.active");
  
  if (shapeContainer) {
    shapeContainer.setAttribute("position", selectedTextAlign);
    const shapeTextHtml = shapeContainer.querySelector(".shapeText").innerHTML.trim();

    drawTextAlign(selectedTextAlign);
    drawShape(shapeContainer, shapeTextHtml);
  } else {
    console.log('No active shape found.');
  }
});

$("#closeShapeToolbar").on("click", function () {
  $("#shapeToolbar").addClass("hidden");
  $("#viewerContainer").removeClass("withToolbar");
})

$("#closeShapeTypeToolbar").on("click", function () {
  $("#shapeTypeToolbar").addClass("hidden");
  $("#viewerContainer").removeClass("withToolbar");
})

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
  rectElement.setAttribute("type", shapeType);
  rectElement.setAttribute("position", selectedTextAlign);
  rectElement.style.position = "absolute";
  rectElement.style.left = `${startX}px`;
  rectElement.style.top = `${startY}px`;

  if (shapeType === "line") {
    rectElement.style.borderBottom = `${selectedBorderWeight} solid ${selectedShapeOutlineColor}`;
    rectElement.style.width = `${selectedBorderWeight}`;
  } else {
    rectElement.style.border = `${selectedBorderWeight} solid ${selectedShapeOutlineColor}`;
    rectElement.style.backgroundColor = selectedShapeFillColor;
    rectElement.style.borderRadius = shapeType === "circle" ? "50%" : selectedBorderRadius;
    rectElement.style.fontSize = `${selectedTextSize}`;
    rectElement.style.fontWeight = selectedTextBold ? "bold" : "normal";
    rectElement.style.fontStyle = selectedTextItalic ? "italic" : "normal";
    rectElement.style.textDecoration = selectedTextUnderline ? "underline" : "none";
    rectElement.style.fontFamily = `${selectedTextFamily}`;
  }

  $(".shape-item").removeClass("active_menu");
  viewer.appendChild(rectElement);
});

viewer.addEventListener("mousemove", function (e) {
  if (!isDrawing) return;

  if (shapeType === "line") {
    const rect = viewer.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    rectElement.style.position = "absolute";
    rectElement.style.width = `${length}px`;
    rectElement.style.height = `${selectedBorderWeight}px`;
    rectElement.style.left = `${startX}px`;
    rectElement.style.top = `${startY}px`;
    rectElement.style.transformOrigin = "0 0";
    rectElement.style.transform = `rotate(${angle}deg)`;
  } else {
    const currentX = e.clientX - viewer.getBoundingClientRect().left;
    const currentY = e.clientY - viewer.getBoundingClientRect().top;
    const width = currentX - startX;
    const height = currentY - startY;

    if (shapeType === "circle") {
      const size = Math.max(Math.abs(width), Math.abs(height));
      rectElement.style.width = `${size}px`;
      rectElement.style.height = `${size}px`;
    } else if (shapeType === "shape") {
      rectElement.style.width = `${Math.abs(width)}px`;
      rectElement.style.height = `${Math.abs(height)}px`;
    }

    rectElement.style.left = `${Math.min(currentX, startX)}px`;
    rectElement.style.top = `${Math.min(currentY, startY)}px`;
  }
});

viewer.addEventListener("mouseup", function (e) {
  if (!isDrawing) return;

  if (shapeType === "line") {
    const rect = viewer.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    rectElement.style.width = `${length}px`;
    rectElement.style.height = `${selectedBorderWeight}px`;
    rectElement.style.left = `${startX}px`;
    rectElement.style.top = `${startY}px`;
    rectElement.style.transformOrigin = "0 0";
    rectElement.style.transform = `rotate(${angle}deg)`;
    rectElement.style.borderRadius = "0px";

    let shape_x_y = PDFViewerApplication.pdfViewer._pages[
      PDFViewerApplication.page - 1
    ].viewport.convertToPdfPoint(startX, endY);

    pos_x_pdf = shape_x_y[0];
    pos_y_pdf = shape_x_y[1];

    isDrawing = false;
    isDrawingShape = false;
    current_form_id = baseId;
    current_shape_id = baseId;

    enableInteractJS(rectElement.id, SHAPE, baseId);
    drawShape(rectElement, "");
  } else {
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

    let shape_x_y = PDFViewerApplication.pdfViewer._pages[
      PDFViewerApplication.page - 1
    ].viewport.convertToPdfPoint(x, y);

    pos_x_pdf = shape_x_y[0];
    pos_y_pdf = shape_x_y[1];

    isDrawing = false;
    isDrawingShape = false;
    current_form_id = baseId;
    current_shape_id = baseId;

    $("#shapeToolbar").css("display", "flex");
    $("#viewerContainer").addClass("withToolbar");
    $(".shape-item").removeClass("active_menu");

    plot.initStore();

    const editableDiv = document.createElement("div");
    editableDiv.className = "shapeText";
    editableDiv.setAttribute("contenteditable", "false");
    editableDiv.style.position = "absolute";
    editableDiv.style.width = "100%";
    editableDiv.style.textAlign = "center";
    editableDiv.style.color = selectedTextColor;
    editableDiv.style.fontSize = selectedTextSize;
    editableDiv.style.fontWeight = selectedTextBold ? "bold" : "normal";
    editableDiv.style.fontStyle = selectedTextItalic ? "italic" : "normal";
    editableDiv.style.textDecoration = selectedTextUnderline ? "underline " : "";
    editableDiv.style.fontFamily = selectedTextFamily;
  
    rectElement.appendChild(editableDiv);
  
    enableInteractJS(rectElement.id, SHAPE, baseId);
    editableDiv.addEventListener("blur", () => {
      const shapeText = editableDiv.innerHTML.trim();
      drawShape(rectElement, shapeText);
    });

    showTextInput(e, editableDiv);
  }
});

viewer.addEventListener("click", function (e) {
  if (isDraft !== "false" && !isEditing) {
    if (form_storage && form_storage !== null) {
      form_storage.forEach((formItem) => {
        if (formItem.form_type === SHAPE) {
          if (formItem.id == current_form_id) {
            const shapeContainer = document.getElementById(formItem.containerId);
            
            let shapeTextDiv = null;
            let shapeText = "";
            
            if (shapeType !== "line") {
              shapeTextDiv = shapeContainer.querySelector(".shapeText");
              if (shapeTextDiv) {
                shapeText = shapeTextDiv.innerHTML.trim();
              }
            }

            handleShape(
              shapeContainer.style.backgroundColor,
              shapeType !== "line" ? shapeContainer.style.borderColor : shapeContainer.style.borderBottomColor,
              shapeTextDiv ? shapeTextDiv.style.color : null,
              shapeContainer.style.borderRadius,
              shapeType !== "line" ? shapeContainer.style.borderWidth : shapeContainer.style.borderBottomWidth,
              shapeTextDiv ? shapeTextDiv.style.fontSize : null,
              shapeTextDiv ? shapeTextDiv.style.fontWeight === "bold" : false,
              shapeTextDiv ? shapeTextDiv.style.fontStyle === "italic" : false,
              shapeTextDiv ? shapeTextDiv.style.textDecoration.includes("underline") : false,
              shapeTextDiv ? shapeTextDiv.style.fontFamily : null,
              selectedTextAlign,
              shapeText,
              shapeType,
              parseInt(shapeContainer.style.width, 10),
              parseInt(shapeContainer.style.height, 10),
              viewer.clientWidth,
              viewer.clientHeight,
            );
          }
        }
      });
    }

    // Existing code to hide the toolbars when clicked outside of shape
    if (!e.target.classList.contains("shapeContainer") && !e.target.closest(".shapeContainer")) {
      document.querySelectorAll(".shapeText").forEach(shapeText => {
        shapeText.setAttribute("contenteditable", "false");
        shapeText.blur();
      });
      $("#shapeToolbar").addClass("hidden");
      $("#shapeTypeToolbar").addClass("hidden");
      $("#viewerContainer").removeClass("withToolbar");
      $(".shapeContainer.active").removeClass("active");
      if (document.getElementById("shape_tooltipbar" + current_shape_id)) {
        document.getElementById("shape_tooltipbar" + current_shape_id).remove();
      }      
    }
  } else {
    document.querySelectorAll(".shapeText").forEach(shapeText => {
      shapeText.setAttribute("contenteditable", "false");
    });
  }
});


viewer.addEventListener("dblclick", function (e) {
  if(isDraft !== "false" && !isEditing){
    if (e.target.classList.contains("shapeContainer") || e.target.closest(".shapeContainer")) {
      $("#shapeToolbar").removeClass("hidden");
      $("#shapeTypeToolbar").addClass("hidden");
      $("#viewerContainer").addClass("withToolbar");
      $(".right-sidebar").removeClass("active");
  
      const shapeContainer = e.target.closest(".shapeContainer");
      const shapeText = shapeContainer.querySelector(".shapeText");

      const existingShapeType = shapeContainer.getAttribute("type");
      const existingShapePosition = shapeContainer.getAttribute("position");
      shapeType = existingShapeType;
      selectedTextAlign = existingShapePosition;

      $(".shapeContainer").removeClass("active");
      $(shapeContainer).addClass("active");

      if(shapeType === "line"){
        initialShapeStyle();

        $("#shape-outline-dropdown").find("input").val(rgbToHex(shapeContainer.style.borderBottomColor));
        $("#border-weight-dropdown input").val(parseInt(shapeContainer.style.borderBottomWidth));
        $("#border-weight-dropdown .range-value").text(shapeContainer.style.borderBottomWidth);
        $("#border-radius-dropdown input").val(parseInt(shapeContainer.style.borderRadius));
        $("#border-radius-dropdown .range-value").text(shapeContainer.style.borderRadius);

        selectedShapeOutlineColor = shapeContainer.style.borderBottomColor;
        selectedBorderWeight = shapeContainer.style.borderBottomWidth;       
        selectedBorderRadius = shapeContainer.style.borderRadius;
      }else{
        showTextInput(e, shapeText);
        $("#list-style-dropdown .dropdown-menu").removeClass("show");
  
        $("#shape-fill-dropdown").find("input").val(rgbToHex(shapeContainer.style.backgroundColor));
        $("#shape-outline-dropdown").find("input").val(rgbToHex(shapeContainer.style.borderColor));
        $("#text-color-dropdown").find("input").val(rgbToHex(shapeText.style.color));

        $("#border-weight-dropdown input").val(parseInt(shapeContainer.style.borderWidth));      
        $("#text-size-dropdown input").val(parseInt(shapeText.style.fontSize));
        $("#border-weight-dropdown .range-value").text(shapeContainer.style.borderWidth);
        $("#text-size-dropdown .range-value").text(shapeText.style.fontSize);

        if(shapeType === "shape"){
          $("#border-radius-dropdown input").val(parseInt(shapeContainer.style.borderRadius));
          $("#border-radius-dropdown .range-value").text(shapeContainer.style.borderRadius);
        }else{
          $("#border-radius-dropdown input").val(0);
        }

        if (shapeText.style.fontWeight === "bold") {
          $("#shape-text-bold").addClass("active");
        } else {
          $("#shape-text-bold").removeClass("active");
        }
    
        if (shapeText.style.fontStyle === "italic") {
          $("#shape-text-italic").addClass("active");
        } else {
          $("#shape-text-italic").removeClass("active");
        }
    
        if (shapeText.style.textDecoration.includes("underline")) {
          $("#shape-text-underline").addClass("active");
        } else {
          $("#shape-text-underline").removeClass("active");
        }
  
        if (shapeText.style.fontFamily && shapeText.style.fontFamily !== "") {
          $(".font-family-container").removeClass("active");
          $(`.font-family-container[family="${shapeText.style.fontFamily}"]`).addClass("active");
        } else {
          $(".font-family-container").removeClass("active");
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
        selectedTextFamily = shapeText.style.fontFamily;

        if (isDraft != null) {
          const horizontalAlign = $("#text-align-dropdown .flex-container.active[type='horizontal']").attr("direction");
          const verticalAlign = $("#text-align-dropdown .flex-container.active[type='vertical']").attr("direction");
          const selectedTextAlign = verticalAlign + "," + horizontalAlign;
  
          drawTextAlign(selectedTextAlign);
        } else {
          drawTextAlign(selectedTextAlign);
        }
      }

      //... add delete button
      const sId = shapeContainer.id.replace("shape", "");
      current_form_id = sId;

      let istooltipshow = false;

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

document.getElementById("add_comment_mode").addEventListener("click", (e) => {
  isTextModeOn = false;
  isAddCommentModeOn = !isAddCommentModeOn;
  handleChange();
});

document.getElementById("add_text").addEventListener("click", (e) => {
  isAddCommentModeOn = false;
  isTextModeOn = !isTextModeOn;
  handleChange();
});

function handleChange() {
  let addText = document.getElementById("add_text");
  let addComment = document.getElementById("add_comment_mode");
  if (!isTextModeOn) {
    addText.classList.remove("active_menu");
  } else {
    addText.classList.add("active_menu");
  }
  if (!isAddCommentModeOn) {
    addComment.classList.remove("active_menu");
    comment_control.style.display = "none";
  } else {
    addComment.classList.add("active_menu");
  }
};

function initialShapeStyle(){
  $("#shape-fill-dropdown").find("input").val("#FFFFFF");
  $("#shape-outline-dropdown").find("input").val("#000000");
  $("#text-color-dropdown").find("input").val("#000000");
  $("#border-radius-dropdown input").val(0);
  $("#border-weight-dropdown input").val(1);
  $("#text-size-dropdown input").val(16);
  $("#shape-text-bold").removeClass("active");
  $("#shape-text-italic").removeClass("active");
  $("#shape-text-underline").removeClass("active");

  selectedShapeFillColor = 'rgb(255, 255, 255)';
  selectedShapeOutlineColor = 'rgb(0, 0, 0)';
  selectedTextColor = 'rgb(0, 0, 0)';
  selectedBorderRadius = '0px';
  selectedBorderWeight = '1px';
  selectedTextSize = '16px';
  selectedTextBold = false;
  selectedTextItalic = false;
  selectedTextUnderline = false;
  selectedTextFamily = 'Courier';
  selectedTextAlign = shapeType === "circle" ? 'middle,center' : 'top,left';
}

function handleShape(shapeFillColor, borderColor, textColor, borderRadius, borderWidth, textSize, textBold, textItalic, textUnderline, textFamily, textAlign, shapeText, shapeType, w, h, canvasWidth, canvasHeight) {
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
      form_storage[i].textFamily = textFamily;
      form_storage[i].textAlign = textAlign;
      form_storage[i].shapeText = shapeText;
      form_storage[i].shapeType = shapeType;
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
      textFamily: textFamily,
      textAlign: textAlign,
      shapeText: shapeText,
      shapeType: shapeType
    });
  }
  const date = new Date(Date.now());
  
  addHistory(baseId, SHAPE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "shape");
};

function enableInteractJS(elementId, type, currentId) {
  let newX = 0,
    newY = 0;
  
  const element = document.getElementById(elementId);
  const interactInstance = interact(`#${elementId}`)

  interactInstance
  .resizable({
    // resize from all edges and corners
    edges: {
      left: ".resize-l",
      right: ".resize-r",
      bottom: ".resize-b",
      top: ".resize-t",
    },

    listeners: {
      move(event) {
        if (!isEditing) {
          var target = event.target;
          let x = parseFloat(target.getAttribute("data-x")) || 0;
          let y = parseFloat(target.getAttribute("data-y")) || 0;

          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.transform = "translate(" + x + "px," + y + "px)";

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);

          resizeShapeHandler(event.rect.width, event.rect.height, currentId);
        }
      },
      end(event) {
        if (!isEditing) {
          let target = event.target;
          let x = parseFloat(target.getAttribute("data-x")) || 0;
          let y = parseFloat(target.getAttribute("data-y")) || 0;
          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
          moveEventHandler(event, x, y, currentId);
        }
      },
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: "parent",
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 15, height: 15 },
      }),
    ],

    inertia: true,
  })
  .draggable({
    listeners: {
      move(event) {
        if (!isEditing) {
          var target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          form_storage.map(function (item) {
            if (item.id === parseInt(currentId)) {
              let posXpdf = item.baseX + x * 0.75 * 0.8;
              let posYpdf = item.baseY - y * 0.75 * 0.8 - item.height;
              if (posXpdf < 0) {
                newX = 0 - item.baseX / 0.75 / 0.8;
              } else if (posXpdf + item.width >= pageWidth) {
                newX = (pageWidth - item.width - item.baseX) / 0.75 / 0.8;
              } else newX = x;
              if (posYpdf < 0) {
                newY = (item.baseY - item.height) / 0.75 / 0.8;
              } else if (posYpdf + item.height >= pageHeight) {
                newY = (item.baseY - pageHeight) / 0.75 / 0.8;
              } else newY = y;
            }
          });
          
          // translate the element
          target.style.transform = "translate(" + newX + "px, " + newY + "px)";

          // update the position attributes
          target.setAttribute("data-x", newX);
          target.setAttribute("data-y", newY);

          drawCrossLines(target);
        }
      },
      end(event) {
        if (!isEditing) {
          const target = event.target;
          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          moveEventHandler(event, newX, newY, currentId);
          $(".horizontal-line, .vertical-line").remove();
        }
      },
    },
  });

  if(shapeType === "line"){
    const getRotationAngle = (element) => {
      const matrix = window.getComputedStyle(element).transform;
      if (matrix === 'none') return 0;
      const values = matrix.split('(')[1].split(')')[0].split(',');
      const a = values[0];
      const b = values[1];
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle;
    };
  
    let originalAngle = getRotationAngle(element);

    interact(`#${elementId}`).draggable({
      listeners: {
        move(event) {
          const target = event.target;
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px) rotate(${originalAngle}deg)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
  
          drawCrossLines(target);
        },
        end(event) {
          const target = event.target;
          handleShape(
            target.style.backgroundColor,
            target.style.borderBottomColor,
            selectedShapeFillColor,
            target.style.borderRadius,
            target.style.borderBottomWidth,
            12,
            false,
            false,
            "none",
            selectedTextFamily,
            selectedTextAlign,
            target.innerHTML.trim(),
            shapeType,
            parseInt(target.style.width, 10),
            parseInt(target.style.height, 10),
            viewer.clientWidth,
            viewer.clientHeight
          );
          $(".horizontal-line, .vertical-line").remove();
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
  }
}

const resizeShapeHandler = function (width, height, currentId) {
  form_storage.map(function (item) {
    if (item.id === parseInt(currentId)) {
      item.width = width * 0.75 * 0.8;
      item.height = height * 0.75 * 0.8;
      item.xPage = width;
      item.yPage = height;
    }
  });
};

function updateText(editableDiv) {
  editableDiv.style.display = 'flex';
  editableDiv.style.textAlign = 'center';
  editableDiv.style.fontWeight = selectedTextBold ? "bold" : "normal";
  editableDiv.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  editableDiv.style.textDecoration = selectedTextUnderline ? "underline" : "none";  
  editableDiv.style.fontSize = selectedTextSize;
  editableDiv.style.color = selectedTextColor;
  editableDiv.style.fontFamily = selectedTextFamily;

  drawTextAlign(selectedTextAlign);
}

function saveText(editableDiv, shapeContainer) {
  updateText(editableDiv, shapeContainer);
  editableDiv.style.display = 'flex';
  editableDiv.style.textAlign = 'center';
  editableDiv.style.fontWeight = selectedTextBold ? "bold" : "normal";
  editableDiv.style.fontStyle = selectedTextItalic ? "italic" : "normal";
  editableDiv.style.textDecoration = selectedTextUnderline ? "underline" : "none";
  editableDiv.style.fontSize = selectedTextSize;
  editableDiv.style.color = selectedTextColor;
  editableDiv.style.fontFamily = selectedTextFamily;

  drawTextAlign(selectedTextAlign);

  shapeText = editableDiv.innerHTML.trim();
  drawShape(shapeContainer, shapeText);
}

function showTextInput(event, editableDiv) {
  editableDiv.setAttribute("contenteditable", "true");
  editableDiv.focus();

  // Set the caret to the end of the content
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(editableDiv);
  range.collapse(false); // Collapse to the end
  selection.removeAllRanges();
  selection.addRange(range);
}


function drawTextAlign(selectedTextAlign) {
  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeContainer.querySelector(".shapeText");

  shapeText.style.textAlign = "";
  shapeText.style.top = "";
  shapeText.style.bottom = "";
  shapeText.style.left = "";
  shapeText.style.transform = "";

  const alignments = selectedTextAlign.split(",").map(align => align.trim());
  const verticalAlign = alignments[0];
  const horizontalAlign = alignments[1];

  shapeText.style.textAlign = horizontalAlign;

  shapeText.style.top = "0";
  shapeText.style.left = "0";
  shapeText.style.transform = "unset";

  if (verticalAlign === "top") {
    shapeText.style.top = "0";
    shapeText.style.bottom = "auto";
  } else if (verticalAlign === "bottom") {
    shapeText.style.top = "auto";
    shapeText.style.bottom = "0";
  } else if (verticalAlign === "middle") {
    shapeText.style.top = "50%";
    shapeText.style.left = "50%";
    shapeText.style.transform = "translate(-50%, -50%)";
  }

  $("#text-align-dropdown .flex-container").removeClass("active");
  $(`#text-align-dropdown .flex-container[direction=${horizontalAlign}]`).addClass("active");
  $(`#text-align-dropdown .flex-container[direction=${verticalAlign}]`).addClass("active");
}

function rgbToHex(rgb) {
  const rgbArray = rgb.match(/\d+/g);
  const hex = rgbArray.map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
  return `#${hex}`;
}

function saveShapeColorStyle(that){
  const color = $(that).parent().find(".shape-colorpicker").val();
  const type = $(that).parent().attr("type");

  const shapeContainer = document.querySelector(".shapeContainer.active");
  const shapeText = shapeType !== "line" && shapeContainer && shapeContainer.querySelector(".shapeText");
  const shapeTextHtml = shapeType !== "line" ? shapeContainer && shapeContainer.querySelector(".shapeText").innerHTML.trim() : "";

  if (type === "background") {
    selectedShapeFillColor = color;
    shapeContainer.style.backgroundColor = color;
  } else if (type === "border") {
    if(shapeType === "line"){
      selectedShapeOutlineColor = color;
      shapeContainer.style.borderBottomColor = color;
    }else{
      selectedShapeOutlineColor = color;
      shapeContainer.style.borderColor = color;
    }
  } else if (type === "text") {
    selectedTextColor = color;
    shapeText.style.color = color;
  }

  drawShape(shapeContainer, shapeTextHtml);
}

function drawShape(shapeContainer, shapeText) {
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
    selectedTextFamily,
    selectedTextAlign,
    shapeText,
    shapeType,
    parseInt(finalRect.width, 10),
    parseInt(finalRect.height, 10),
    viewer.clientWidth,
    viewer.clientHeight,
  );
}

//... Manage List Style
const listContainer = document.getElementById('list-container');

$(".dropdown-toggle").click(function () {
  if($(this).parent().attr("id") != "list-style-dropdown"){    
    $("#list-style-dropdown .dropdown-menu").removeClass("show"); 
  }else{    
    $("#list-style-dropdown .dropdown-menu").toggleClass("show");
  }
});

// Event listener for selecting a list style
document.querySelectorAll('#list-styles .flex-container').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('#list-styles .flex-container').forEach(el => el.classList.remove('active'));
    this.classList.add('active');

    selectedListType = this.getAttribute('list-type'); // Update selected list type
    listCounter = 1; // Reset the counter for the new list style

    // Update existing list items with the new style
    updateListItemsStyle();
  });
});

// Event listener for adding an option
document.getElementById('list-add-btn').addEventListener('click', function () {
  const inputText = document.querySelector('#list-input').value.trim();
  if (inputText === '') {
    alert('Please enter some text!');
    return;
  }

  // Generate the list item with the remove icon
  const listItemHtml = generateListItemHtml(inputText, selectedListType);
  listContainer.insertAdjacentHTML('beforeend', listItemHtml);

  // Clear the input field
  document.querySelector('#list-input').value = '';

  // Add event listeners for removing items
  listContainer.querySelectorAll('.remove-list-item').forEach(btn => {
    btn.addEventListener('click', function () {
      this.parentElement.remove();
      updateListItemsStyle(); // Recalculate list style after item removal
    });
  });

  updateListItemsStyle(); // Update style after adding a new item
});

// Event listener for saving the list
document.getElementById('list-save-btn').addEventListener('click', function () {
  const shapeText = document.querySelector('.shapeText');

  // Iterate over all list items and save them in the shape
  const listItems = listContainer.querySelectorAll('.list-item');
  listItems.forEach(item => {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = item.querySelector('.list-marker').textContent + ' ' + item.querySelector('.list-text').textContent;
    shapeText.appendChild(newDiv);
  });

  // Optionally, you can clear the list container if needed
  listContainer.innerHTML = '';
  $("#list-style-dropdown .dropdown-menu").removeClass("show");
});

// Function to generate list item HTML with a remove button
function generateListItemHtml(text, listType) {
  let listMarker = getListMarker(listType);
  return `
    <div class="list-item">
      <span class="list-marker">${listMarker}</span> <span class="list-text">${text}</span>
      <i class="fa fa-trash remove-list-item"></i>
    </div>
  `;
}

// Function to update existing list items when the style is changed
function updateListItemsStyle() {
  const listItems = listContainer.querySelectorAll('.list-item .list-marker');
  listCounter = 1; // Reset the list counter before reapplying styles

  listItems.forEach(item => {
    item.textContent = getListMarker(selectedListType); // Update each item's marker
  });
}

// Helper function to generate the list marker
function getListMarker(listType) {
  switch (listType) {
    case 'numeric':
      return listCounter++ + '.';
    case 'roman':
      return getRomanNumeral(listCounter++) + '.';
    case 'alpha-lower':
      return String.fromCharCode(96 + listCounter++) + '.'; // a., b., c. ...
    case 'alpha-upper':
      return String.fromCharCode(64 + listCounter++) + '.'; // A., B., C. ...
    case 'dash':
      return '-';
    case 'dot':
      return '•';
    default:
      return '';
  }
}

// Roman numeral conversion (helper function)
function getRomanNumeral(num) {
  const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}
