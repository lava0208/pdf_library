const addShapeBtn = document.getElementById("shape_format");
const squreImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmUAAAEDCAYAAAB0ynP9AAAAAXNSR0IArs4c6QAADWxJREFUeF7t2TEKw0AMAEHd/x+d4KuC0/sWPFelsxipWMiamc94BAgQIECAAAECRwWWKDvq7+MECBAgQIAAgS3wG2XXb48AAQIECBAgQOBZgf2vpSh7Ft3XCBAgQIAAAQJ3AVHmJggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEDgL8oCMxmBAAECBAgQIPBOgTUzu848AgQIECBAgACBcwJfDr0CH66ENEoAAAAASUVORK5CYII=";

let isDrawingShape = isDraft == "true";
console.log("isDraft " + isDraft);
const ratio = Math.max(window.devicePixelRatio || 1, 1);

$(addShapeBtn).on("click", function () {
  $("#editorShapeFormatToolbar").toggleClass("hidden");
});

$(".shape-item").on("click", function () {
  isDrawingShape = true;
  $("#editorShapeFormatToolbar").addClass("hidden");
});

const handleShape = function (w, h, canvasWidth, canvasHeight) {
  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      form_storage[i].imgData = shapeImgData;
      break;
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
      imgId: "shapeImg" + baseId,
      form_type: SHAPE,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      imgData: shapeImgData,
    });
  }
  const date = new Date(Date.now());
  addHistory(baseId, SHAPE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "shape");
};

$("#viewer").on("click", function (e) {
  console.log("isDrawingShape " + isDrawingShape);
  if (isDrawingShape) {
    baseId++;
    let ost = computePageOffset();
    let x = e.pageX - ost.left;
    let y = e.pageY - ost.top;

    let pageId = String(PDFViewerApplication.page);
    let pg = document.getElementById(pageId);

    let shape_x_y = PDFViewerApplication.pdfViewer._pages[
      PDFViewerApplication.page - 1
    ].viewport.convertToPdfPoint(x, y);

    pos_x_pdf = shape_x_y[0];
    pos_y_pdf = shape_x_y[1];

    let shapeId = baseId;
    current_form_id = shapeId;

    let shapeWidth = 0;
    let shapeHeight = 0;

    $("#clear-canvas").click();
    let canvas = $("#shape-canvas")[0];
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    plot.initStore();
    isDrawingShape = false;
    $(addShapeBtn).removeClass("active_menu");

    cropCanvas(canvas);
    shapeImgData = squreImg;

    shapeWidth = 300;
    shapeHeight = 150;

    const shapeImg = document.createElement("img");
    shapeImg.id = "shapeImg" + shapeId;
    shapeImg.style.width = "100%";
    shapeImg.style.height = "100%";
    shapeImg.src = shapeImgData;
    shapeImg.style.objectFit = "fill";

    const shapeContainer = document.createElement("div");
    shapeContainer.id = "shape" + shapeId;
    shapeContainer.style.position = "absolute";
    shapeContainer.style.top = y + "px";
    shapeContainer.style.left = x + "px";
    shapeContainer.style.width = shapeWidth + "px";
    shapeContainer.style.height = shapeHeight + "px";
    shapeContainer.style.zIndex = standardZIndex;
    shapeContainer.tabIndex = 0;
    shapeContainer.classList.add("form-fields");

    // Append contenteditable div to shapeContainer
    const editableDiv = document.createElement("div");
    editableDiv.setAttribute("contenteditable", "true");
    editableDiv.style.position = "absolute";
    editableDiv.style.width = "100%";
    editableDiv.style.height = "100%";
    editableDiv.style.textAlign = "center";
    editableDiv.focus();

    shapeContainer.appendChild(editableDiv);
    shapeContainer.append(shapeImg);
    pg.appendChild(shapeContainer);
    resizeCanvas(shapeContainer.id, SHAPE, shapeId);

    editableDiv.addEventListener("dblclick", (event) => {
      current_shape_id = shapeId;
      showTextInput(event, shapeContainer, editableDiv);

      let istooltipshow = false;

      if (document.getElementById("shape_tooltipbar" + current_shape_id)) {
        istooltipshow = true;
      }

      if (isDragging) {
        isDragging = false;
      } else {
        if (!istooltipshow) {
          let tooltipbar = document.createElement("div");
          let editBtn = document.createElement("button");
          editBtn.style.padding = "5px";
          editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
          $(editBtn).on("click", function () {
            let targetShape = form_storage.filter(function (item) {
              return item.id == parseInt(current_shape_id);
            });
            $("#drawing-board-container").css("display", "flex");
            let targetCtx = canvas.getContext("2d");
            targetCtx.clearRect(0, 0, canvas.width, canvas.height);
            let image = new Image();
            image.src = targetShape[0].imgData;

            image.onload = function () {
              let centerX = canvas.width / 2 - image.width / 2;
              let centerY = canvas.height / 2 - image.height / 2;
              targetCtx.drawImage(image, centerX, centerY);
            };
            $("#drawing-shape-create").on("click", function () {
              shapeImgData = cropCanvas(canvas);
              shapeWidth = boundingBox.width;
              shapeHeight = boundingBox.height;
              $("#drawing-board-container").css("display", "none");
              shapeImg.src = shapeImgData;
              handleShape(shapeWidth, shapeHeight, canvas.width, canvas.height);
            });
          });
          tooltipbar.append(editBtn);
          current_form_id = shapeId;
          addDeleteButton(
            current_shape_id,
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
    });

    handleShape(boundingBox.width, boundingBox.height, canvas.width, canvas.height);
    $("#drawing-shape-create").off("click");
  }
});

function updateText(editableDiv) {
  editableDiv.style.display = 'block';
  editableDiv.style.textAlign = 'center';
}

function saveText(editableDiv, shapeContainer) {
  updateText(editableDiv, shapeContainer);
  editableDiv.style.display = 'block';
  editableDiv.style.textAlign = 'center';
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

  // Place the caret at the clicked position
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  if (range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Add event listeners
  editableDiv.addEventListener('blur', () => saveText(editableDiv, shapeContainer), { once: true });
  editableDiv.addEventListener('input', () => updateText(editableDiv, shapeContainer));
}