const addShapeBtn = document.getElementById("shape_format");
const squreImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmUAAAEDCAYAAAB0ynP9AAAAAXNSR0IArs4c6QAADWxJREFUeF7t2TEKw0AMAEHd/x+d4KuC0/sWPFelsxipWMiamc94BAgQIECAAAECRwWWKDvq7+MECBAgQIAAgS3wG2XXb48AAQIECBAgQOBZgf2vpSh7Ft3XCBAgQIAAAQJ3AVHmJggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEBAlAWWYAQCBAgQIECAgChzAwQIECBAgACBgIAoCyzBCAQIECBAgAABUeYGCBAgQIAAAQIBAVEWWIIRCBAgQIAAAQKizA0QIECAAAECBAICoiywBCMQIECAAAECBESZGyBAgAABAgQIBAREWWAJRiBAgAABAgQIiDI3QIAAAQIECBAICIiywBKMQIAAAQIECBAQZW6AAAECBAgQIBAQEGWBJRiBAAECBAgQICDK3AABAgQIECBAICAgygJLMAIBAgQIECBAQJS5AQIECBAgQIBAQECUBZZgBAIECBAgQICAKHMDBAgQIECAAIGAgCgLLMEIBAgQIECAAAFR5gYIECBAgAABAgEBURZYghEIECBAgAABAqLMDRAgQIAAAQIEAgKiLLAEIxAgQIAAAQIERJkbIECAAAECBAgEBERZYAlGIECAAAECBAiIMjdAgAABAgQIEAgIiLLAEoxAgAABAgQIEBBlboAAAQIECBAgEBAQZYElGIEAAQIECBAgIMrcAAECBAgQIEAgICDKAkswAgECBAgQIEBAlLkBAgQIECBAgEBAQJQFlmAEAgQIECBAgIAocwMECBAgQIAAgYCAKAsswQgECBAgQIAAAVHmBggQIECAAAECAQFRFliCEQgQIECAAAECoswNECBAgAABAgQCAqIssAQjECBAgAABAgREmRsgQIAAAQIECAQERFlgCUYgQIAAAQIECIgyN0CAAAECBAgQCAiIssASjECAAAECBAgQEGVugAABAgQIECAQEBBlgSUYgQABAgQIECAgytwAAQIECBAgQCAgIMoCSzACAQIECBAgQECUuQECBAgQIECAQEDgL8oCMxmBAAECBAgQIPBOgTUzu848AgQIECBAgACBcwJfDr0CH66ENEoAAAAASUVORK5CYII=";

let isDrawingShape = isDraft == "true" ? true : false;
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
    if (
      form_storage[i].id == current_form_id
    ) {
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
    if (
      form_storage[j].id != current_form_id
    )
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

    // $("#drawing-board-container").css("display", "flex");

    $("#clear-canvas").click();
    // let origin = localStorage.getItem("modifiedContentDrawingShape")
    // if(origin) $("#drawing-board-container").html(origin);
    // let canvas = $("#drawing-board").find("canvas")[0];
    let canvas = $("#shape-canvas")[0];
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    plot.initStore();
    isDrawingShape = false;
    $(addShapeBtn).removeClass("active_menu");
    // $("#drawing-shape-create").on("click", function () {
      cropCanvas(canvas);

      shapeImgData = squreImg;

      shapeWidth = 300;
      shapeHeight = 150;

      // $("#drawing-board-container").css("display", "none");
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

      shapeContainer.append(shapeImg);
      pg.appendChild(shapeContainer);
      resizeCanvas(shapeContainer.id, SHAPE, shapeId);

      shapeContainer.addEventListener("dblclick", (event) => {
        current_shape_id = shapeId;

        showTextInput(event, shapeContainer);

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
    // })
  }
});


let currentShape;
const textInput = document.getElementById('shape-text-input');

textInput.addEventListener('blur', () => saveText());
textInput.addEventListener('input', () => updateText());

function updateText() {
  const text = textInput.value.trim();

  if (text) {
    let textObj = currentShape.querySelector('.text-content');

    if (!textObj) {
      textObj = document.createElement('div');
      textObj.classList.add('text-content');
      currentShape.appendChild(textObj);
    }

    textObj.textContent = text;
    textObj.style.position = 'absolute';
    textObj.style.left = '50%';
    textObj.style.top = '50%';
    textObj.style.transform = 'translate(-50%, -50%)';
    textObj.style.whiteSpace = 'nowrap';
    textObj.style.pointerEvents = 'none';
  }
}

function saveText() {
  updateText();
  textInput.style.display = 'none';
  const textObj = currentShape.querySelector('.text-content');
  if (textObj) {
    textObj.style.display = 'block';
  }
}

function showTextInput(event) {
  currentShape = shape1;
  const shapeRect = currentShape.getBoundingClientRect();
  const textObj = currentShape.querySelector('.text-content');

  if (textObj) {
    textInput.value = textObj.textContent;
  } else {
    textInput.value = '';
  }

  const shapeCenterX = shapeRect.left + shapeRect.width / 2;
  const shapeCenterY = shapeRect.top + shapeRect.height / 2;

  textInput.style.display = 'block';
  textInput.style.left = `${shapeCenterX - textInput.offsetWidth / 2}px`;
  textInput.style.top = `${shapeCenterY - textInput.offsetHeight / 2}px`;
  textInput.focus();

  if (textObj) {
    textObj.style.display = 'none';
  }
}