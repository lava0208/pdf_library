// let baseId = 0;
let draw_form_storage;
let current_form_id = 0;
let active_form_index = -1;
let currentMode = null;
let ratio = Math.max(window.devicePixelRatio || 1, 1);

let checkboxCount = 1,
  radioCount = 1,
  textfieldCount = 1,
  comboCount = 1,
  listCount = 1,
  buttonCount = 1,
  datefieldCount = 1,
  numberfieldCount = 1;

let comboboxOptionCount = 0;
let listboxOptionCount = 0;
let comboboxOptionArray = [];
let listboxOptionArray = [];

let pos_x_pdf = 0,
  pos_y_pdf = 0;
let pos_x_page = 0,
  pos_y_page = 0;
let fontStyle = "",
  fontSize = 0,
  textColor = "",
  textBackgroundColor = "",
  borderColor = "",
  borderWidth = "";

const SUBMIT = 1,
  RESET = 2,
  NOACTION = 3;

const ALIGN_LEFT = 0,
  ALIGN_RIGHT = 2,
  ALIGN_CENTER = 1;
let alignValue = 0;

let pageWidth = 0,
  pageHeight = 0;

let isOptionPane = false;

let current_checkbox_id = 0;
let current_radio_id = 0;
let current_text_id = 0;
let current_combo_id = 0;
let current_list_id = 0;
let current_button_id = 0;
let current_date_id = 0;
let current_date_content_id = 0;
let current_signature_id = 0;
let current_shape_id = 0;
let current_photo_id = 0;

let signatureImgData, shapeImgData, photoData;

let boundingBox;

let openHeader = document.getElementsByClassName("openHeader");

const fontStyleArr = [
  "Courier",
  "Helvetica",
  "TimesRoman",
  "Arial",
  "Calibri",
  "Consolas",
  "Georgia",
  "Tahoma",
  "Verdana",
];

const fontSizeArr = [
  "Auto",
  4,
  6,
  8,
  10,
  12,
  14,
  16,
  18,
  24,
  36,
  48,
  64,
  72,
  96,
  144,
  192,
];

const borderSizeArr = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
];

const colorArr = [
  "purple",
  "fuchsia",
  "navy",
  "blue",
  "teal",
  "aqua",
  "green",
  "lime",
  "olive",
  "yellow",
  "maroon",
  "red",  
  "gray",
  "silver",
  "thistle",
  "black",
  "white",
  "transparent",
];

let formWidth = 25;
let formHeight = 25;

let selectedAlign = "",
  groupNameAlign = "";

function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  return id;
}

const generalUserMode = function () {
  if (initialId) {
    //... open draft document
    if (isDraft == null || isDraft == "") {
      shareDocumentButton.style.display = "none";
      addCommentButton.style.display = "none";
      showHistoryButton.style.display = "none";
      saveDraftButton.style.display = "none";
      submitDocumentButton.style.display = "flex";
      changeMode();
    } else {
    if (isDraft == "true" || isDraft == null) {
        const viewer = document.getElementById('viewer');
        viewer.addEventListener('click', e => { });
        viewer.dispatchEvent(new Event('click'));
      } else {
        //... open submitted document
        shareDocumentButton.style.display = "none";
        addCommentButton.style.display = "none";
        showHistoryButton.style.display = "none";
        saveDraftButton.style.display = "none";
        submitDocumentButton.style.display = "none";
        changeMode();
      }
    }
  }
  if(isOpenEmailPdf){
    searchFormButton.style.display = "flex";
  }
}

const drawFormElement = function () {
  form_storage = draw_form_storage.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.id === value.id
    ))
  );

  if(isDraft == "true"){
    var last_form = form_storage[form_storage.length - 1];
    if(last_form){
      baseId = last_form.id;
    }
  }

  if(form_storage == undefined){
    form_storage = [];
  };

  if(text_storage == undefined){
    text_storage = [];
  }

  let checkedCheckboxes = [];

  if (form_storage && form_storage !== null) {

    //... initialize variable
    let tmpCheckboxCount = 1;
    let tmpRadioCount = 1;
    let tmpTextfieldCount = 1;
    let tmpComboCount = 1;
    let tmpListCount = 1;
    let tmpButtonCount = 1;
    let tmpDatefieldCount = 1;
    let tmpNumberfieldCount = 1;

    form_storage.forEach((item) => {
      let id = item.id;
      let new_x_y, x, y, width, height;

      if (item.form_type === 1) {
        tmpCheckboxCount++;
      } else if (item.form_type === 2) {
        tmpRadioCount++;
      } else if (item.form_type === 3) {
        tmpTextfieldCount++;
      } else if (item.form_type === 4) {
        tmpComboCount++;
      } else if (item.form_type === 5) {
        tmpListCount++;
      } else if (item.form_type === 6) {
        tmpButtonCount++;
      } else if (item.form_type === 8) {
        tmpDatefieldCount++;
      } else if (item.form_type === 13) {
        tmpNumberfieldCount++;
      }

      if (item.form_type != RADIO) {
        x = item.x;
        y = item.y;
        width = item.xPage;
        height = item.yPage;
        item.baseX = item.x;
        item.baseY = item.y;
      } else {
        x = item.data.x;
        y = item.data.y;
        width = item.data.xPage;
        height = item.data.yPage;
        item.data.baseX = item.data.x;
        item.data.baseY = item.data.y;
      }
      if (PDFViewerApplication.pdfViewer._pages[PDFViewerApplication.page - 1] == undefined) {
        location.reload();
      }
      new_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToViewportPoint(x, y);
      x = new_x_y[0];
      y = new_x_y[1];
      let pg = document.getElementById(String(item.page_number));

      switch (item.form_type) {
        case CHECKBOX:
          let checkbox = document.createElement("div");
          checkbox.id = "checkbox" + id;
          addFormElementStyle(checkbox, y, x, width, height);
          let checkmark = document.createElement("div");
          checkmark.style.display = 'none';
          checkmark.classList.add("checkmark", "form-container");
          checkbox.classList.add("checkbox");
          checkbox.appendChild(checkmark);

          if (item.isChecked) {
            checkbox.classList.add("checked");
            checkedCheckboxes.push(id);
          }

          checkbox.onclick = function (e) {
            const checkedId = e.target.parentNode.id;
            current_form_id = checkedId.replace("checkbox", "");
            toggleCheckbox(checkedId);

            let isChecked = checkbox.classList.contains("checked");
            var checkboxIndex = form_storage.findIndex(x => x.form_field_name === item.form_field_name) + 1;

            if (checkboxIndex !== 0) {
              if (isChecked) {
                if (!checkedCheckboxes.includes(checkboxIndex)) {
                  checkedCheckboxes.push(checkboxIndex);
                }
              } else {
                checkedCheckboxes = checkedCheckboxes.filter(index => index !== checkboxIndex);
              }

              updateFormStorage(form_storage, checkedCheckboxes);
            }
          };
          pg.append(checkbox);
          document.getElementById("checkbox-field-input-name").value = item.form_field_name;
          document.getElementById("checkbox-label").value = item.label;
          document.getElementById("checkbox-value").value = item.value;
          current_checkbox_id = id;

          checkbox.addEventListener("click", (e) => {
            const checkedId = e.target.parentNode.id;
            current_checkbox_id = checkedId;
            DrawType = CHECKBOX;
          });

          checkbox.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_checkbox_id = id;
              let istooltipshow = false;
              if (
                document.getElementById("checkbox_tooltipbar" + current_checkbox_id)
              ) {
                istooltipshow = true;
              }
              if (isDragging) {
                isDragging = false;
              } else {
                if (!istooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("checkbox-field-input-name").value =
                        element.form_field_name;
                      document.getElementById("checkbox-label").value =
                        element.label;
                      document.getElementById("checkbox-value").value =
                        element.value;
                      document.getElementById("checkbox-background-color").value =
                        element.textBackgroundColor;

                      isOptionPane = true;
                      option = showOption(
                        CHECKBOX_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );

                      $(document).on("click", "#" + CHECKBOX_OPTION, function(){
                        document.getElementById(checkbox.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + CHECKBOX_OPTION, function(){
                        document.getElementById(checkbox.id).style.zIndex = selectedZIndex;
                      });

                      checkbox.append(option);
                    }
                  });
                  document
                    .getElementById("checkbox-save-button")
                    .addEventListener("click", handleCheckbox);
                  addDeleteButton(
                    current_checkbox_id,
                    tooltipbar,
                    checkbox,
                    "checkbox"
                  );
                } else {
                  document
                    .getElementById("checkbox_tooltipbar" + current_checkbox_id)
                    .remove();
                }
              }
              document.getElementById(checkbox.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document
            .getElementById("checkbox-save-button")
            .addEventListener("click", handleCheckbox);
          resizeCanvas(checkbox.id, CHECKBOX, id, CHECKBOX_OPTION);

          break;
        case RADIO:
          let radio = document.createElement("div");
          radio.id = "radio" + id;
          addFormElementStyle(radio, y, x, width, height);
          radio.style.borderRadius = "50%";
          radio.classList.add("radio-container");
          let inputRadio = document.createElement("input");
          inputRadio.type = "radio";
          inputRadio.classList.add('radioinputchild', 'form-container');
          inputRadio.name = item.data.option;

          let spanElement = document.createElement("span");
          spanElement.classList.add("checkmark-radio", "form-container");
          inputRadio.style.display = "none";
          spanElement.style.display = "none";

          if(item.data.isChecked && isOpenEmailPdf){
          // if(item.data.isChecked){
            setTimeout(() => {
              $("#" + item.containerId).find("input").prop("checked", true);
            }, 100);
          }

          radio.append(inputRadio, spanElement);
          radio.onclick = function () {
            current_form_id = id;
            selectRadioButton(this, id);
          };

          pg.appendChild(radio);

          current_radio_id = id;

          radio.addEventListener("click", () => {
            current_radio_id = id;
            DrawType = RADIO;
          })

          radio.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_radio_id = id;

              let isradiotooltipshow = false;

              if (document.getElementById("radio_tooltipbar" + current_radio_id)) {
                isradiotooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!isradiotooltipshow) {
                  let tooltipbar = document.createElement("div");

                  current_form_id = id;
                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("radio-field-input-name").value =
                        element.data.option;
                      document.getElementById("radio-label").value =
                        element.data.label;
                      document.getElementById("radio-value").value =
                        element.data.value;
                      document.getElementById("radio-background-color").value =
                        element.textBackgroundColor;

                      isOptionPane = true;
                      option = showOption(
                        RADIO_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );

                      $(document).on("click", "#" + RADIO_OPTION, function(){
                        document.getElementById(radio.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + RADIO_OPTION, function(){
                        document.getElementById(radio.id).style.zIndex = selectedZIndex;
                      });

                      radio.append(option);
                    }
                  });

                  document
                    .getElementById("radio-save-button")
                    .addEventListener("click", handleRadio);

                  addDeleteButton(current_radio_id, tooltipbar, radio, "radio");

                  radio.appendChild(tooltipbar);
                } else {
                  document
                    .getElementById("radio_tooltipbar" + current_radio_id)
                    .remove();
                }
              }
              document.getElementById(radio.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });
          document
            .getElementById("radio-save-button")
            .addEventListener("click", handleRadio);
          resizeCanvas(radio.id, RADIO, id, RADIO_OPTION);
          break;
        case TEXTFIELD:
          let textDiv = document.createElement("div");
          textDiv.id = "text" + id;
          addFormElementStyle(textDiv, y, x, width, height);

          let inputElement = document.createElement("input");
          inputElement.classList.add("text-field-input", "form-container");
          inputElement.style.display = "none";
          inputElement.addEventListener("input", function () {
            current_form_id = id;
            handleText();
          });

          if(item.initialValue !== ""){
            inputElement.value = item.initialValue;
          }

          textDiv.append(inputElement);

          pg.appendChild(textDiv);

          showOptionAndResizebar(
            TEXTFIELD_OPTION,
            textDiv,
            width,
            height,
            "text"
          );

          current_text_id = id;
          const textfieldAlign = document.querySelectorAll(
            'input[type=radio][name="text-field"]'
          );
          textfieldAlign.forEach(function (radio) {
            radio.addEventListener("change", handleRadioSelection);
          });
          textDiv.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_text_id = id;

              let istexttooltipshow = false;

              if (document.getElementById("text_tooltipbar" + current_text_id)) {
                istexttooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!istexttooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;

                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("text-field-input-name").value =
                        element.form_field_name;
                      isOptionPane = true;
                      option = showOption(
                        TEXTFIELD_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
                      document.getElementById("text-font-style").value =
                        element.fontStyle;
                      document.getElementById("text-font-size").value =
                        element.fontSize;
                      document.getElementById("text-font-color").value =
                        element.textColor;
                      document.getElementById("text-font-background-color").value =
                        element.textBackgroundColor;
                      document.getElementById("text-border-color").value =
                        element.borderColor;
                      document.getElementById("text-border-width").value =
                        element.borderWidth;

                      let selected = element.align;
                      if (selected == ALIGN_LEFT)
                        document.getElementById("text-left").checked = true;
                      if (selected == ALIGN_CENTER)
                        document.getElementById("text-center").checked = true;
                      if (selected == ALIGN_RIGHT)
                        document.getElementById("text-right").checked = true;

                      $(document).on("click", "#" + TEXTFIELD_OPTION, function(){
                        document.getElementById(textDiv.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + TEXTFIELD_OPTION, function(){
                        document.getElementById(textDiv.id).style.zIndex = selectedZIndex;
                      });

                      textDiv.append(option);
                    }
                  });

                  document
                    .getElementById("text-save-button")
                    .addEventListener("click", handleText);

                  addDeleteButton(current_text_id, tooltipbar, textDiv, "text");
                } else {
                  document
                    .getElementById("text_tooltipbar" + current_text_id)
                    .remove();
                }
              }
              document.getElementById(textDiv.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document.getElementById(TEXTFIELD_OPTION).style.display = "none";

          document
            .getElementById("text-save-button")
            .addEventListener("click", handleText);
          resizeCanvas(textDiv.id, TEXTFIELD, id, TEXTFIELD_OPTION);
          break;
        case COMBOBOX:
          let comboDiv = document.createElement("div");
          comboDiv.id = "combo" + id;
          addFormElementStyle(comboDiv, y, x, width, height);

          let selectElement = document.createElement("select");
          selectElement.classList.add("combobox-field-input", "form-container");
          selectElement.style.display = "none";
          selectElement.addEventListener("change", function (e) {
            current_form_id = id;
            handleCombo();

            if(e.target.value != null){
              item.initialValue = e.target.value;
            }
          });

          if(item.initialValue !== ""){
            setTimeout(() => {
              selectElement.value = item.initialValue;
            }, 100);
          }
          
          comboDiv.append(selectElement);

          pg.appendChild(comboDiv);

          showOptionAndResizebar(
            COMBOBOX_OPTION,
            comboDiv,
            width,
            height,
            "combo"
          );
          const comboAlign = document.querySelectorAll(
            'input[type=radio][name="text-field"]'
          );
          comboAlign.forEach(function (radio) {
            radio.addEventListener("change", handleRadioSelection);
          });

          current_combo_id = id;

          comboDiv.addEventListener("dblclick", (e) => {
            if (!isEditing) {
              current_combo_id = id;

              let iscombotooltipshow = false;

              if (document.getElementById("combo_tooltipbar" + current_combo_id)) {
                iscombotooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!iscombotooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
                  document.getElementById("option-content").innerHTML = "";
                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("combo-input-name").value =
                        element.form_field_name;
                      isOptionPane = true;
                      option = showOption(
                        COMBOBOX_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
                      document.getElementById("combo-font-style").value =
                        element.fontStyle;
                      document.getElementById("combo-font-size").value =
                        element.fontSize;
                      document.getElementById("combo-font-color").value =
                        element.textColor;
                      document.getElementById("combo-font-background-color").value =
                        element.textBackgroundColor;
                      document.getElementById("combo-border-color").value =
                        element.borderColor;
                      document.getElementById("combo-border-width").value =
                        element.borderWidth;

                      element.optionArray.forEach((elementItem, index) => {
                        const optionContent = document.createElement("div");
                        const deleteDivId = `delete-span-${comboboxOptionCount}`;
                        optionContent.id = `comboOption${deleteDivId}`;
                        optionContent.className = "combobox-options-content";
                        const contentSpan = document.createElement("span");
                        contentSpan.textContent = elementItem;
                        const deleteSpan = document.createElement("span");
                        deleteSpan.className = "option-delete";
                        deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                        deleteSpan.addEventListener("click", function () {
                          // Remove the corresponding div when the delete span is clicked
                          element.optionArray = element.optionArray.filter((item, i) => i !== index);
                          optionContent.remove();
                        });
                        optionContent.append(contentSpan, deleteSpan);
                        document.getElementById("option-content").append(optionContent);
                        comboboxOptionCount++;
                      });

                      $(document).on("click", "#" + COMBOBOX_OPTION, function(){
                        document.getElementById(comboDiv.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + COMBOBOX_OPTION, function(){
                        document.getElementById(comboDiv.id).style.zIndex = selectedZIndex;
                      });

                      comboDiv.append(option);
                    }
                  });

                  document
                    .getElementById("combo-save-button")
                    .addEventListener("click", handleCombo);

                  addDeleteButton(current_combo_id, tooltipbar, comboDiv, "combo");
                } else {
                  // document
                  //   .getElementById("combo_tooltipbar" + current_combo_id)
                  //   .remove();
                }
              }
              document.getElementById(comboDiv.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document.getElementById(COMBOBOX_OPTION).style.display = "none";

          document.getElementById("add-option").addEventListener("click", () => {
            const optionName = document.getElementById("option-description").value;
            const optionContainer = document.getElementById("option-content");
            const optionContent = document.createElement("div");
            const deleteDivId = `delete-span-${comboboxOptionCount}`;

            optionContent.id = `comboOption${deleteDivId}`;
            optionContent.className = "combobox-options-content";
            const contentSpan = document.createElement("span");
            contentSpan.textContent = optionName;

            const deleteSpan = document.createElement("span");
            deleteSpan.className = "option-delete";
            deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

            if (optionName != "") comboboxOptionArray.push(optionName);

            deleteSpan.addEventListener("click", function () {
              // Remove the corresponding div when the delete span is clicked
              comboboxOptionArray = comboboxOptionArray.filter(function (item) {
                return item !== optionName;
              });
              optionContent.remove();
            });
            optionContent.appendChild(contentSpan);
            optionContent.appendChild(deleteSpan);

            if (optionName != "") {
              optionContainer.appendChild(optionContent);
              comboboxOptionCount++;
            }

            document.getElementById("option-description").value = "";
          });

          document
            .getElementById("combo-save-button")
            .addEventListener("click", handleCombo);

          resizeCanvas(comboDiv.id, COMBOBOX, id, COMBOBOX_OPTION);
          break;
        case LIST:
          let listDiv = document.createElement("div");
          listDiv.id = "list" + id;
          addFormElementStyle(listDiv, y, x, width, height);

          let dropList = document.createElement("div");
          dropList.style.display = "none";
          dropList.classList.add("list-field-input", "form-container");

          listDiv.append(dropList);

          pg.appendChild(listDiv);

          showOptionAndResizebar(
            LIST_OPTION,
            listDiv,
            width,
            height,
            "list"
          );
          const listAlign = document.querySelectorAll(
            'input[type=radio][name="text-field"]'
          );
          listAlign.forEach(function (radio) {
            radio.addEventListener("change", handleRadioSelection);
          });

          current_list_id = id;

          listDiv.addEventListener("dblclick", (e) => {
            if (!isEditing) {
              current_list_id = id;

              let islisttooltipshow = false;

              if (document.getElementById("list_tooltipbar" + current_list_id)) {
                islisttooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!islisttooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
                  document.getElementById("option-content-list").innerHTML = "";
                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("list-input-name").value =
                        element.form_field_name;
                      isOptionPane = true;
                      option = showOption(
                        LIST_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
                      document.getElementById("list-font-style").value =
                        element.fontStyle;
                      document.getElementById("list-font-size").value =
                        element.fontSize;
                      document.getElementById("list-font-color").value =
                        element.textColor;
                      document.getElementById("list-font-background-color").value =
                        element.textBackgroundColor;
                      document.getElementById("list-border-color").value =
                        element.borderColor;
                      document.getElementById("list-border-width").value =
                        element.borderWidth;                        

                      element.optionArray.map((elementItem) => {
                        const optionContent = document.createElement("div");
                        const deleteDivId = `delete-span-${listboxOptionCount}`;
                        optionContent.id = `listOption${deleteDivId}`;
                        optionContent.className = "combobox-options-content";
                        const contentSpan = document.createElement("span");
                        contentSpan.textContent = elementItem;
                        const deleteSpan = document.createElement("span");
                        deleteSpan.className = "option-delete";
                        deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                        deleteSpan.addEventListener("click", function () {
                          // Remove the corresponding div when the delete span is clicked
                          element.optionArray = element.optionArray.filter(function (item) {
                            return item !== elementItem;
                          });
                          optionContent.remove();
                        });
                        optionContent.append(contentSpan, deleteSpan);
                        document
                          .getElementById("option-content-list")
                          .append(optionContent);
                      });

                      $(document).on("click", "#" + LIST_OPTION, function(){
                        document.getElementById(listDiv.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + LIST_OPTION, function(){
                        document.getElementById(listDiv.id).style.zIndex = selectedZIndex;
                      });

                      listDiv.append(option);
                    }
                  });
                  document
                    .getElementById("list-save-button")
                    .addEventListener("click", handleList);

                  addDeleteButton(current_list_id, tooltipbar, listDiv, "list");
                } else {
                  // document
                  //   .getElementById("list_tooltipbar" + current_list_id)
                  //   .remove();
                }
              }
              document.getElementById(listDiv.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document.getElementById(LIST_OPTION).style.display = "none";

          document
            .getElementById("add-option-list")
            .addEventListener("click", () => {
              const optionName = document.getElementById(
                "option-description-list"
              ).value;
              const optionContainer = document.getElementById(
                "option-content-list"
              );
              const optionContent = document.createElement("div");
              const deleteDivId = `delete-span-${listboxOptionCount}`;

              optionContent.id = `listOption${deleteDivId}`;
              optionContent.className = "combobox-options-content";
              const contentSpan = document.createElement("span");
              contentSpan.textContent = optionName;

              const deleteSpan = document.createElement("span");
              deleteSpan.className = "option-delete";
              deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

              if (optionName != "") listboxOptionArray.push(optionName);

              deleteSpan.addEventListener("click", function () {
                // Remove the corresponding div when the delete span is clicked
                listboxOptionArray = listboxOptionArray.filter(function (item) {
                  return item !== optionName;
                });
                optionContent.remove();
              });
              optionContent.appendChild(contentSpan);
              optionContent.appendChild(deleteSpan);

              if (optionName != "") {
                optionContainer.appendChild(optionContent);
                listboxOptionCount++;
              }

              document.getElementById("option-description-list").value = "";
            });

          document
            .getElementById("list-save-button")
            .addEventListener("click", handleList);

          resizeCanvas(listDiv.id, LIST, id, LIST_OPTION);
          break;
        case BUTTON:
          let buttonDiv = document.createElement("div");
          buttonDiv.id = "button" + id;
          addFormElementStyle(buttonDiv, y, x, width, height);

          let buttonAction = document.createElement("div");
          buttonAction.classList.add("button-field-input", "form-container");
          buttonAction.style.display = "none";
          buttonAction.addEventListener("click", function (event) {
            let parentElement = event.target.parentNode;
            let newId = parentElement.id.replace("button", "");
            form_storage.forEach((item) => {
              if (item.id == newId) {
                if (item.action === SUBMIT) {
                  if (window.confirm('Do you want to submit now?')) {
                    submitAction();
                  }
                }
                else if (item.action === RESET) {

                }
              }
            })
          })
          buttonDiv.append(buttonAction);

          pg.appendChild(buttonDiv);

          showOptionAndResizebar(
            BUTTON_OPTION,
            buttonDiv,
            width,
            height,
            "button"
          );
          const buttonAlign = document.querySelectorAll(
            'input[type=radio][name="text-field"]'
          );
          buttonAlign.forEach(function (radio) {
            radio.addEventListener("change", handleRadioSelection);
          });
          document.getElementById(
            "button-field-input-name"
          ).value = `Button Form Field ${buttonCount++}`;
          document.getElementById("button-text").value = "Button";
          current_button_id = id;
          buttonDiv.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_button_id = id;

              let isbuttontooltipshow = false;

              if (
                document.getElementById("button_tooltipbar" + current_button_id)
              ) {
                isbuttontooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!isbuttontooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("button-field-input-name").value =
                        element.form_field_name;
                      isOptionPane = true;
                      option = showOption(
                        BUTTON_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
                      document.getElementById("button-font-style").value =
                        element.fontStyle;
                      document.getElementById("button-font-size").value =
                        element.fontSize;
                      document.getElementById("button-font-color").value =
                        element.textColor;
                      document.getElementById("button-font-background-color").value =
                        element.textBackgroundColor;
                      document.getElementById("button-border-color").value =
                        element.borderColor;
                      document.getElementById("button-border-width").value =
                        element.borderWidth;

                      const selectedValue = document.getElementById("button-field-input-action") && document.getElementById("button-field-input-action").value;
                      if (element.action == SUBMIT) {
                        selectedValue.value = "submit";
                      } else if (element.action == RESET) {
                        selectedValue.value = "reset";
                      }

                      $(document).on("click", "#" + BUTTON_OPTION, function(){
                        document.getElementById(buttonDiv.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + BUTTON_OPTION, function(){
                        document.getElementById(buttonDiv.id).style.zIndex = selectedZIndex;
                      });

                      buttonDiv.append(option);
                    }
                  });
                  document
                    .getElementById("button-save-button")
                    .addEventListener("click", handleButton);
                  addDeleteButton(
                    current_button_id,
                    tooltipbar,
                    buttonDiv,
                    "button"
                  );
                } else {
                  document
                    .getElementById("button_tooltipbar" + current_button_id)
                    .remove();
                }
              }
              document.getElementById(buttonDiv.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document.getElementById(BUTTON_OPTION).style.display = "none";

          // const buttonValue = document.getElementById("button-text");
          // buttonValue.addEventListener('change', () => {
          //     document.getElementById(buttonDiv.id).textContent = buttonValue.value;
          // })

          document
            .getElementById("button-save-button")
            .addEventListener("click", handleButton);
          resizeCanvas(buttonDiv.id, BUTTON, id, BUTTON_OPTION);
          break;
        case DATE:
          let dateDiv = document.createElement("div");
          dateDiv.id = "date" + id;
          addFormElementStyle(dateDiv, y, x, width, height);

          const newDate = document.createElement("input");
          newDate.id = "datecontent" + id;
          newDate.classList.add("date-field-input", "form-container");
          newDate.style.position = "relative";
          newDate.type = "date";
          newDate.style.width = "100%";
          newDate.style.height = "100%";
          newDate.value = item.text;
          newDate.style.display = "none";

          newDate.addEventListener("change", (e) => {
            let dateId = id;
            current_form_id = dateId;
            handleDate();

            item.text = e.target.value;
          });

          dateDiv.append(newDate);
          pg.appendChild(dateDiv);

          // Show TextField OptionPane
          showOptionAndResizebar(
            DATE_OPTION,
            dateDiv,
            width,
            height,
            "date"
          );

          newDate.style.fontFamily = item.fontStyle;
          newDate.style.fontSize = item.fontSize + "px";
          newDate.style.color = item.textColor;

          //... background color
          // newDate.style.backgroundColor = document.getElementById("date-font-background-color").value;

          document
            .getElementById("date-font-style")
            .addEventListener("change", () => {
              document.getElementById(current_date_content_id).style.fontFamily =
                document.getElementById("date-font-style").value;
            });
          document
            .getElementById("date-font-size")
            .addEventListener("change", () => {
              document.getElementById(current_date_content_id).style.fontSize =
                document.getElementById("date-font-size").value + "px";
            });
          document
            .getElementById("date-font-color")
            .addEventListener("change", () => {
              document.getElementById(current_date_content_id).style.color =
                document.getElementById("date-font-color").value;
            });
          document
            .getElementById("date-font-background-color")
            .addEventListener("change", () => {
              document.getElementById(current_date_content_id).style.backgroundColor =
                document.getElementById("date-font-background-color").value;
            });

          current_date_id = id;
          current_date_content_id = newDate.id;

          dateDiv.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_date_id = id;
              current_date_content_id = newDate.id;

              let isdatetooltipshow = false;

              if (document.getElementById("date_tooltipbar" + current_date_id)) {
                isdatetooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!isdatetooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;

                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("date-input-name").value =
                        element.form_field_name;
                      isOptionPane = true;
                      option = showOption(
                        DATE_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
                      document.getElementById("date-font-style").value =
                        element.fontStyle;
                      document.getElementById("date-font-size").value =
                        element.baseFontSize;
                      document.getElementById("date-font-color").value =
                        element.textColor;
                      document.getElementById("date-font-background-color").value =
                        element.textBackgroundColor;
                      document.getElementById("date-border-color").value =
                        element.borderColor;
                      document.getElementById("date-border-width").value =
                        element.borderWidth;

                      let selected = element.align;
                      if (selected == ALIGN_LEFT)
                        document.getElementById("date-left").checked = true;
                      if (selected == ALIGN_CENTER)
                        document.getElementById("date-center").checked = true;
                      if (selected == ALIGN_RIGHT)
                        document.getElementById("date-right").checked = true;

                      $(document).on("click", "#" + DATE_OPTION, function(){
                        document.getElementById(dateDiv.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + DATE_OPTION, function(){
                        document.getElementById(dateDiv.id).style.zIndex = selectedZIndex;
                      });

                      dateDiv.append(option);
                    }
                  });

                  document
                    .getElementById("date-save-button")
                    .addEventListener("click", handleDate);

                  addDeleteButton(current_date_id, tooltipbar, dateDiv, "date");
                } else {
                  document
                    .getElementById("date_tooltipbar" + current_date_id)
                    .remove();
                }
              }
              document.getElementById(dateDiv.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document.getElementById(DATE_OPTION).style.display = "none";

          document
            .getElementById("date-save-button")
            .addEventListener("click", handleDate);
          resizeCanvas(dateDiv.id, DATE, id, DATE_OPTION);
          break;
        case SIGNATURE:
          const signatureContainer = document.createElement("div");
          signatureContainer.className = "signatureContainer", "form-container";
          signatureContainer.id = "signature" + id;
          addFormElementStyle(signatureContainer, y, x, width, height);
          
          signatureContainer.style.display = "flex";
          signatureContainer.style.alignItems = "center";
          signatureContainer.style.justifyContent = "center";
          signatureContainer.style.color = "black";
          signatureContainer.style.minHeight = "40px";
          signatureContainer.textContent = "Double click to sign here!";

          form_storage.map((element) => {
            if (element.id == id) {
              document.getElementById("signature-font-background-color").value =
                element.textBackgroundColor;
              document.getElementById("signature-border-color").value =
                element.borderColor;
              document.getElementById("signature-border-width").value =
                element.borderWidth;

              if (isDraft == "false" || isDraft == null) {
                setTimeout(() => {
                  $("#" + element.containerId).css({"background-color": element.textBackgroundColor, "border": element.borderWidth + "px solid " + element.borderColor});
                }, 100);
              }
            }
          })

          if (item.imgData) {
            if (item.imgData.includes("data:image/png;base64")) {
              createAndAppendImage(item.imgData, signatureContainer, id);
            } else {
              imageUrlToBase64(item.imgData)
                .then(async base64 => {
                  createAndAppendImage(base64, signatureContainer, id);
                })
            }
          }

          pg.appendChild(signatureContainer);

          current_signature_id = id;
          
          signatureContainer.addEventListener("click", () => {
            if (!isEditing) {
              current_signature_id = id;

              let issigntooltipshow = false;

              if (
                document.getElementById("signature_tooltipbar" + current_signature_id)
              ) {
                issigntooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!issigntooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
                  addDeleteButton(
                    current_signature_id,
                    tooltipbar,
                    signatureContainer,
                    "signature"
                  );
                } else {
                  document
                    .getElementById("signature_tooltipbar" + current_signature_id)
                    .remove();
                }
              }
            }
          });

          signatureContainer.addEventListener("dblclick", () => {
            current_form_id = id;
            // if (!isEditing && !isSubmit) {
            if (!isSubmit) {
              const signature_creator = document.getElementById(SIGNATURE_OPTION);
              signature_creator.style.display = "flex";
              document.getElementById("signature-initial-tab").click();
              resetCanvas();
              document.getElementById("signature-close").onclick = function () {
                signature_creator.style.display = "none";
              };
              document.getElementById("signature-close-button").onclick = function () {
                signature_creator.style.display = "none";
              };

              let canvasDraw = document.querySelector("#signature-draw-body canvas");
              let hasDrawn = false;

              canvasDraw.addEventListener('click', function () {
                hasDrawn = true;
              });

              document.getElementById("signature-create").onclick = function () {
                let canvas;

                signature_creator.style.display = "none";

                if (currentSignType == DRAW) {
                  if (hasDrawn) {
                    canvas = document.querySelector("#signature-draw-body canvas");
                    signatureImgData = cropCanvas(canvas);
                    createAndAppendImage(signatureImgData);
                  }
                } else if (currentSignType == TYPE) {
                  let canvasType = document.getElementById("signature-type-text").value;
                  if (canvasType != "") {
                    canvas = document.getElementById("signature-type-canvas");
                    signatureImgData = cropCanvas(canvas);
                    createAndAppendImage(signatureImgData);
                  }
                } else if (currentSignType == UPLOAD) {
                  const file = document.getElementById("signature-image-input")
                    .files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      signatureImgData = e.target.result;
                      createAndAppendImage(signatureImgData);
                      handleSignature();
                    };
                    reader.readAsDataURL(file);
                  } else {
                    alert("Please select an image file.");
                    handleSignature();
                  }
                } else if (currentSignType == PROFILE) {
                  if (selectedProfileSignature) {
                    signatureImgData = selectedProfileSignature;
                    createAndAppendImage(selectedProfileSignature);
                  } else {
                    alert("Please select an image file.");
                  }
                }
                handleSignature();

                function createAndAppendImage(imgData) {
                  signature_creator.style.display = "none";
                  const signatureImg = document.createElement("img");
                  signatureImg.className = "signatureImg";
                  signatureImg.id = "signatureImg" + id;
                  signatureImg.style.width = "100%";
                  signatureImg.style.height = "100%";
                  signatureImg.src = imgData;
                  signatureImg.style.objectFit = "cover";
                  signatureContainer.textContent = "";
                  signatureContainer.append(signatureImg);

                  resizeCanvas(signatureContainer.id, SIGNATURE, id);
                }
              };
            }
          });

          // handleSignature();
          resizeCanvas(signatureContainer.id, SIGNATURE, id);

          break;
        case SHAPE:
          let canvas = $("#drawing-shape-board").find("canvas")[0];
          canvas.width = item.canvasWidth * ratio;
          canvas.height = item.canvasHeight * ratio;

          const shapeContainer = document.createElement("div");
          shapeContainer.className = "shapeContainer";
          shapeContainer.id = "shape" + id;
          shapeContainer.style.position = "absolute";

          if(item.shapeType === "line"){
            const deltaX = item.baseX - item.x;
            const deltaY = item.baseY - item.y;

            shapeContainer.style.top = `${y + deltaY / 2}px`;
            shapeContainer.style.left = `${x + deltaX / 2}px`;
            shapeContainer.style.width = width + "px";
            shapeContainer.style.height = height !== null ? `${height}px` : "auto";
            // shapeContainer.style.zIndex = standardZIndex;

            shapeContainer.style.borderBottom = `${item.borderWidth || '1px'} solid ${item.borderColor || '#000000'}`;
            const angle = Math.atan2(item.baseY, item.baseX) * (180 / Math.PI);
            shapeContainer.style.transform = `rotate(${angle}deg)`;
          } else {
            shapeContainer.style.top = y + "px";
            shapeContainer.style.left = x + "px";
            shapeContainer.style.width = width + "px";
            shapeContainer.style.height = height + "px";
            // shapeContainer.style.zIndex = standardZIndex;
            shapeContainer.style.display = "flex";
            shapeContainer.style.alignItems = "center";
            shapeContainer.style.justifyContent = "center";
            shapeContainer.style.flexDirection = "column";
            shapeContainer.style.backgroundColor = item.shapeFillColor;
            shapeContainer.style.border = `${item.borderWidth} solid ${item.borderColor}`;
            shapeContainer.style.borderRadius = item.borderRadius;
            shapeContainer.tabIndex = 0;
            shapeContainer.classList.add("form-fields");
  
            const editableDiv = document.createElement("div");
            editableDiv.className = "shapeText";
            editableDiv.setAttribute("contenteditable", "true");
            editableDiv.innerHTML = item.shapeText;
            editableDiv.style.position = "absolute";
            editableDiv.style.width = "100%";
            // editableDiv.style.height = "100%";
            editableDiv.style.fontStyle = item.textItalic ? "italic" : "normal";
            editableDiv.style.fontWeight = item.textBold ? "bold" : "normal";
            editableDiv.style.textDecoration = item.textUnderline ? "underline" : "none";
            editableDiv.style.fontSize = item.textSize;
            editableDiv.style.color = item.textColor;
            editableDiv.style.fontFamily = item.textFamily;
  
            shapeTextAlign(editableDiv, item.textAlign);
            editableDiv.focus();
  
            // shapeContainer.append(shapeImg);
            shapeContainer.append(editableDiv);
          }

          pg.appendChild(shapeContainer);
          resizeCanvas(shapeContainer.id, SHAPE, id);

          shapeContainer.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_shape_id = id;
              let istooltipshow = false;

              if (document.getElementById("shape_tooltipbar" + current_shape_id)) {
                istooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!istooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
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
            }
          });
          $("#drawing-shape-create").off("click");
          break;
        case PHOTO:
          const photoContainer = document.createElement("div");
          photoContainer.className = "photoContainer";
          photoContainer.id = "photo" + id;
          addPhotoElementStyle(photoContainer, y, x, width, height);
          photoContainer.style.display = "flex";
          photoContainer.style.alignItems = "center";
          photoContainer.style.justifyContent = "center";
          photoContainer.style.color = "black";
          photoContainer.style.minHeight = "40px";
          photoContainer.textContent = "Double click to upload image!";

          form_storage.map((element) => {
            if (element.id == id) {
              document.getElementById("photo-background-color").value =
                element.textBackgroundColor;
              document.getElementById("photo-border-color").value =
                element.borderColor;
              document.getElementById("photo-border-width").value =
                element.borderWidth;

              if (isDraft == "false" || isDraft == null) {
                setTimeout(() => {
                  $("#" + element.containerId).css({"background-color": element.textBackgroundColor, "border": element.borderWidth + "px solid " + element.borderColor});
                }, 100);
              }
            }
          })

          if (item.photoData) {
            if (item.photoData.includes("data:image/png;base64")) {
              createAndAppendPhotoImage(item.photoData, photoContainer, id);
            } else {
              imageUrlToBase64(item.photoData)
                .then(async base64 => {
                  createAndAppendPhotoImage(base64, photoContainer, id);
                })
            }
          }

          pg.appendChild(photoContainer);

          current_photo_id = id;

          resizeCanvas(photoContainer.id, PHOTO, id);
          photoContainer.addEventListener("click", () => {
            if (!isEditing) {
              current_photo_id = id;

              let istooltipshow = false;

              if (
                document.getElementById("photo_tooltipbar" + current_photo_id)
              ) {
                istooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!istooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;
                  addDeleteButton(
                    current_photo_id,
                    tooltipbar,
                    photoContainer,
                    "photo"
                  );
                } else {
                  document
                    .getElementById("photo_tooltipbar" + current_photo_id)
                    .remove();
                }
              }
            }
          });

          photoContainer.addEventListener("dblclick", () => {
            current_form_id = id;
            // if (!isEditing && !isSubmit) {
            if (!isSubmit) {
              const image_creator = document.getElementById(PHOTO_OPTION);
              image_creator.style.display = "flex";
              document.getElementById("photo-close").onclick = function () {
                image_creator.style.display = "none";
              };
              document.getElementById("photo-close-button").onclick = function () {
                image_creator.style.display = "none";
              };

              document.getElementById("photo-create").onclick = function () {
                image_creator.style.display = "none";
                const file = document.getElementById("photo-input")
                  .files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    photoData = e.target.result;
                    handlePhoto();
                    
                    createAndAppendPhotoImage(photoData, photoContainer, current_form_id);
                  };
                  reader.readAsDataURL(file);
                } else {
                  handlePhoto();
                }
              };
            }
          });
          break;
        case NUMBERFIELD:
          let numberDiv = document.createElement("div");
          numberDiv.id = "number" + id;
          addFormElementStyle(numberDiv, y, x, width, height);

          manageNumField(parseInt(item.count), numberDiv);

          $(document).on("change", ".number-field-input", function(){
            current_form_id = id;
            handleNumber();
          })

          pg.appendChild(numberDiv);

          if(item.count !== ""){
            document.getElementById("count").value = item.count;
          }

          if(item.initialValue !== ""){
            var initialValueArr = item.initialValue.split("");
            $("#" + numberDiv.id).find(".number-field-input").each(function(i){
              $(this).val(initialValueArr[i])
            })
          }

          showOptionAndResizebar(
            NUMBERFIELD_OPTION,
            numberDiv,
            width,
            height,
            "number"
          );

          current_number_id = id;
          const numberfieldAlign = document.querySelectorAll(
            'input[type=radio][name="number-field"]'
          );
          numberfieldAlign.forEach(function (radio) {
            radio.addEventListener("change", handleRadioSelection);
          });
          numberDiv.addEventListener("dblclick", () => {
            if (!isEditing) {
              current_number_id = id;

              let isnumbertooltipshow = false;

              if (document.getElementById("number_tooltipbar" + current_number_id)) {
                isnumbertooltipshow = true;
              }

              if (isDragging) {
                isDragging = false;
              } else {
                if (!isnumbertooltipshow) {
                  let tooltipbar = document.createElement("div");
                  current_form_id = id;

                  form_storage.map((element) => {
                    if (element.id == id) {
                      document.getElementById("number-field-input-name").value =
                        element.form_field_name;
                      isOptionPane = true;
                      option = showOption(
                        NUMBERFIELD_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
                      document.getElementById("number-font-style").value =
                        element.fontStyle;
                      document.getElementById("number-font-size").value =
                        element.fontSize;
                      document.getElementById("number-font-color").value =
                        element.textColor;
                      document.getElementById("number-font-background-color").value =
                        element.textBackgroundColor;
                      document.getElementById("number-border-color").value =
                        element.borderColor;
                      document.getElementById("number-border-width").value =
                        element.borderWidth;
                      
                      document.getElementById("count").value = element.count;

                      let selected = element.align;
                      if (selected == ALIGN_LEFT)
                        document.getElementById("number-left").checked = true;
                      if (selected == ALIGN_CENTER)
                        document.getElementById("number-center").checked = true;
                      if (selected == ALIGN_RIGHT)
                        document.getElementById("number-right").checked = true;

                      $(document).on("click", "#" + NUMBERFIELD_OPTION, function(){
                        document.getElementById(numberDiv.id).style.zIndex = selectedZIndex;
                      });
                      $(document).on("mousedown", "#" + NUMBERFIELD_OPTION, function(){
                        document.getElementById(numberDiv.id).style.zIndex = selectedZIndex;
                      });

                      numberDiv.append(option);
                    }
                  });

                  addDeleteButton(current_number_id, tooltipbar, numberDiv, "number");
                } else {
                  document
                    .getElementById("number_tooltipbar" + current_number_id)
                    .remove();
                }
              }
              document.getElementById(numberDiv.id).style.zIndex = selectedZIndex;
              displayFormProps();
            }
          });

          document.getElementById(NUMBERFIELD_OPTION).style.display = "none";

          document.getElementById("number-save-button").addEventListener("click", function() {
            handleNumber();
            const count = parseInt(document.getElementById("count").value);
            const activeNumberDiv = document.getElementById(`number${current_number_id}`);
            if (!isNaN(count)) {
              manageNumField(count, activeNumberDiv);
            }
          });

          resizeCanvas(numberDiv.id, NUMBERFIELD, id, NUMBERFIELD_OPTION);

          // Update manageNumField to append inputs to numberDiv
          function manageNumField(count, numberDiv) {
            const numberFormWidth = 30;
            numberDiv.style.width = numberFormWidth * count + "px";
            numberDiv.querySelectorAll(".number-field-input").forEach(el => el.remove());
          
            for (let i = 1; i <= count; i++) {
              let numberElement = document.createElement("input");
              numberElement.classList.add("number-field-input", "form-container");
              numberElement.type = "number";
              numberElement.min = "0";
              numberElement.max = "9";
              numberElement.style.display = "none";
              
              numberElement.addEventListener("input", function (e) {
                const value = parseInt(numberElement.value, 10);
                
                if (!isNaN(value) && value >= 0 && value <= 9) {
                  const nextInput = numberElement.nextElementSibling;
                  if (nextInput && nextInput.classList.contains("number-field-input")) {
                    nextInput.focus();
                  }
                } else {
                  numberElement.value = "";
                }
              });
              // Append the input to the numberDiv
              numberDiv.appendChild(numberElement);
            }
          }

          break;
        default:
          break;
      }
    })

    //... initialize variable
    checkboxCount = tmpCheckboxCount;
    radioCount = tmpRadioCount;
    textfieldCount = tmpTextfieldCount;
    comboCount = tmpComboCount;
    listCount = tmpListCount;
    datefieldCount = tmpDatefieldCount;
    buttonCount = tmpButtonCount;
    numberfieldCount = tmpNumberfieldCount;
  }

  if (text_storage  && text_storage !== null) {
    text_storage.forEach((item) => {
      let new_x_y, x, y;
      x = item.x;
      y = item.y;
      item.baseX = item.x;
      item.baseY = item.y;
      new_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToViewportPoint(x, y);
      x = new_x_y[0];
      y = new_x_y[1];
      let pg = document.getElementById(String(item.page_number));
      const newText = document.createElement("div");
      let textofStorage = '';
      item.text.forEach((textitem, index) => {
        textofStorage += textitem;
        if (index < item.text.length - 1) {
          textofStorage += '\n';
        }
      })
      newText.innerHTML = textofStorage.replace(/\n/g, '<br>');
      newText.classList.add("textcontent");
      newText.classList.add("oldtextcontent");
      newText.id = item.textContentId;

      const container = document.createElement("div");
      container.classList.add("text-content");
      container.id = item.containerId;
      container.style.position = "absolute";
      container.style.top = y + "px";
      container.style.left = x + "px";
      container.style.width = "fit-content";
      container.style.height = "fit-content";
      // container.style.zIndex = 101;
      container.tabIndex = 0;
      container.append(newText);
      pg.append(container);
      newText.style.fontFamily = item.regularFontStyle;
      newText.style.fontWeight = item.isBold ? "bold" : "";
      newText.style.fontStyle = item.isItalic ? "italic" : "";
      newText.style.textDecoration = item.isUnderline ? "underline" : "none";
      newText.style.fontSize = `${item.fontSize}px`;
      newText.style.color = item.textColor;
    })
  }
  generalUserMode();
  if(!isSubmit && isOpenEmailPdf){
    searchForm();
  }  
}

//... Change Font Style Event
$(document).on("click", ".text-weight-button", function () {
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
  } else {
    $(this).addClass("active");
  }
})

document.addEventListener("DOMContentLoaded", function () {
  loadFontFiles();
  requestId = getIdFromUrl();

  let username = localStorage.getItem('username');

  var url = "";
  if(isDraft != null){
    url = initialId && isDraft ? `${BASE_URL}/history/${username}/${initialId}` : `${BASE_URL}/getpdfdata?uniqueId=${requestId}`;
  }else{
    url = `${BASE_URL}/getpdfform?uniqueId=${initialId}`;
  }

  if (initialId) {
    $("body").addClass("loading");
    fetch(`${url}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if(data !== null){
          form_storage = isDraft == "true" ? [] : isDraft == null || isDraft == "" ? data[0].formData && JSON.parse(data[0].formData) : data.formData && JSON.parse(data.formData);
          clientName = isDraft == null || isDraft == "" ? data[0].name : data.name;
          clientEmail = isDraft == null || isDraft == "" ? data[0].email : data.email;

          const dataURI = isDraft ? data.pdfData : data[0].pdfData;
          const base64Data = dataURI.split(',')[1];
          const binaryData = atob(base64Data);

          const array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            array[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([array], { type: 'application/pdf' });

          const fileName = 'downloaded.pdf';
          const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

          if(isDraft){
            if (data.formData) {
              draw_form_storage = JSON.parse(data.formData);
            }
          }else{
            if(data[0].formData){
              draw_form_storage = JSON.parse(data[0].formData);
            }
          }

          text_storage = isDraft ? data.textData && JSON.parse(data.textData) : data[0].textData && JSON.parse(data[0].textData);
          PDFViewerApplication.open({
            url: URL.createObjectURL(pdfFile),
            originalUrl: pdfFile.name,
          });

          console.log("*******");
          console.log(draw_form_storage);
          
          const checkViewerInterval = setInterval(() => {
            if (PDFViewerApplication.pdfDocument && PDFViewerApplication.pdfDocument.numPages > 0) {
              clearInterval(checkViewerInterval);
              drawFormElement();
            }
          }, 100)
        }
        $("body").removeClass("loading");
      })
      .catch(error => {
        console.error('Error fetching data from the backend:', error);
      });
  }
});

// Check the same form field name and modify field name
const checkFormField = function (id) {
  const formFieldName = document.getElementById(id).value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }
  return { count, formFieldName };
};

// Remove the parent event.
const removeParentEvent = function (id) {
  if (document.getElementById(id)) {
    document.getElementById(id).addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
  interact(`#${id}`).draggable({
    listeners: {
      move(event) {
        event.stopPropagation();
      },
    },
  });
};

function handleRadioSelection(event) {
  const selectedRadioButton = event.target;
  if (selectedRadioButton.checked) {
    selectedAlign = selectedRadioButton.value;
    groupNameAlign = selectedRadioButton.name;
    
    if (selectedAlign == "left") {
      alignValue = ALIGN_LEFT;
    } else if (selectedAlign == "center") {
      alignValue = ALIGN_CENTER;
    } else if (selectedAlign == "right") {
      alignValue = ALIGN_RIGHT;
    }
  }
}

const convertStandardDateType = function (date) {
  const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate;
}

// When click "Save" button, save the information of Checkbox element.

const handleCheckbox = function (e) {
  isOptionPane = false;
  if (document.getElementById(CHECKBOX_OPTION)) {
    document.getElementById(CHECKBOX_OPTION).style.display = "none";
  }
  if (e) e.stopPropagation();

  const { count, formFieldName } = checkFormField("checkbox-field-input-name");
  const label = document.getElementById("checkbox-label").value;
  const value = document.getElementById("checkbox-value").value;
  textBackgroundColor = document.getElementById("checkbox-background-color") && document.getElementById("checkbox-background-color").value;

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if(!isEditing){
        form_storage[i].textBackgroundColor = textBackgroundColor;
        form_storage[i].form_field_name = formFieldName;
      }

      //... handle track
      handleTrack(form_storage[i].id, formFieldName);
      break;
    } else if (
      form_storage[i].form_field_name == formFieldName &&
      form_storage[i].id != current_form_id
    ) {
      break;
    } else if (
      form_storage[i].form_field_name != formFieldName &&
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].form_field_name = formFieldName;
      break;
    }
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "checkbox" + baseId,
      form_type: CHECKBOX,
      form_field_name: formFieldName,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
      isChecked: false,
      isReadOnly: false,
      label: label,
      value: value,
      textBackgroundColor: textBackgroundColor,
    });

    textBackgroundColor = "";

    const date = new Date(Date.now());
    addHistory(baseId, CHECKBOX, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, 'checkbox');
  }
  document
    .getElementById("checkbox-save-button")
    .removeEventListener("click", handleCheckbox);
};
// When click "Save" button, save the information of RadioGroup element.

const handleRadio = function (e) {
  isOptionPane = false;
  const label = document.getElementById("radio-label") && document.getElementById("radio-label").value;
  const value = document.getElementById("radio-value") && document.getElementById("radio-value").value;
  textBackgroundColor = document.getElementById("radio-background-color") && document.getElementById("radio-background-color").value;

  if (document.getElementById(RADIO_OPTION)) document.getElementById(RADIO_OPTION).style.display = "none";
  const formFieldName = document.getElementById("radio-field-input-name") && document.getElementById("radio-field-input-name").value;
  const currentRadio = document.getElementById(`radio${current_radio_id}`);
  if (currentRadio) currentRadio.querySelector('input[type="radio"]').name = formFieldName;
  if (e) e.stopPropagation();
  let count = 0,
    isData = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (form_storage[j].id != current_form_id) count++;
    if (form_storage[j].hasOwnProperty("data")) isData++;
  }
  if (isData) {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].hasOwnProperty("data")) {
        if (
          form_storage[i].data.option != formFieldName &&
          form_storage[i].id == current_form_id
        ) {
          form_storage[i].data.option = formFieldName;
          break;
        }

        if (form_storage[i].id == current_form_id) {
          form_storage[i].form_field_name = formFieldName;
          form_storage[i].textBackgroundColor = textBackgroundColor;

          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        }
      }
    }
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "radio" + baseId,
      form_type: RADIO,
      page_number: PDFViewerApplication.page,
      data: {
        option: formFieldName,
        x: pos_x_pdf,
        y: pos_y_pdf,
        baseX: pos_x_pdf,
        baseY: pos_y_pdf,
        width: formWidth * 0.75 * 0.8,
        height: formHeight * 0.75 * 0.8,
        xPage: formWidth,
        yPage: formHeight,
        isChecked: false,
        isReadOnly: false,
        label: label,
        value: value,
      },
    });
    const date = new Date(Date.now());
    addHistory(baseId, RADIO, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "radio");
  }
  document
    .getElementById("radio-save-button")
    .removeEventListener("click", handleRadio);
};
// When click "Save" button, save the information of TextField element.

const handleText = function (e) {  
  isOptionPane = false;
  if (document.getElementById(TEXTFIELD_OPTION)) document.getElementById(TEXTFIELD_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("text-field-input-name") && document.getElementById("text-field-input-name").value;
  const regularFont = document.getElementById("text-font-style") && document.getElementById("text-font-style").value;

  fontStyle = generateFontName("text-font-style");
  fontSize = document.getElementById("text-font-size") && parseInt(document.getElementById("text-font-size").value);
  textColor = document.getElementById("text-font-color") && document.getElementById("text-font-color").value;
  textBackgroundColor = document.getElementById("text-font-background-color") && document.getElementById("text-font-background-color").value;
  borderColor = document.getElementById("text-border-color") && document.getElementById("text-border-color").value;
  borderWidth = document.getElementById("text-border-width") && document.getElementById("text-border-width").value;

  var selectedAlign = document.querySelector('input[type=radio][name="text-field"]:checked') && document.querySelector('input[type=radio][name="text-field"]:checked').value;
  if (selectedAlign == "left") {
    alignValue = ALIGN_LEFT;
  } else if (selectedAlign == "center") {
    alignValue = ALIGN_CENTER;
  } else if (selectedAlign == "right") {
    alignValue = ALIGN_RIGHT;
  }  

  let initialValue = "";
  const currentFormText = document.getElementById(`text${current_form_id}`);
  if (currentFormText) {
    initialValue = currentFormText.querySelector(".text-field-input").value;
  }

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if (!isEditing) {
        if (!isOpenEmailPdf) {
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;
          form_storage[i].align = alignValue;
          form_storage[i].isBold = isBold;
          form_storage[i].isItalic = isItalic;
          form_storage[i].isUnderline = isUnderline;
          form_storage[i].regularFontStyle = regularFont;
          
          form_storage[i].textBackgroundColor = textBackgroundColor;
          form_storage[i].borderColor = borderColor;
          form_storage[i].borderWidth = borderWidth;
          form_storage[i].form_field_name = formFieldName;
  
          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        } else {
          form_storage[i].initialValue = initialValue;
        }
      } else {
        form_storage[i].initialValue = initialValue;
      }
    }
  }

  let count = 0;

  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "text" + baseId,
      form_type: TEXTFIELD,
      form_field_name: formFieldName,
      initialValue: initialValue,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      regularFontStyle: regularFont,
      isBold: isBold,
      isItalic: isItalic,
      isUnderline: isUnderline,
      fontSize: fontSize,
      textColor: textColor,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });

    fontStyle = "";
    fontSize = 12;
    textColor = "";
    textBackgroundColor = "";
    borderColor = "";
    borderWidth = "";

    alignValue = 0;
    const date = new Date(Date.now());
    addHistory(baseId, TEXTFIELD, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "text");
  }

  document
    .getElementById("text-save-button")
    .removeEventListener("click", handleText);
  removeBoldItalicEvent();
};
// When click "Save" button, save the information of Combobox element.

const handleCombo = function (e) {
  isOptionPane = false;
  if (document.getElementById(COMBOBOX_OPTION)) document.getElementById(COMBOBOX_OPTION).style.display = "none";
  if (e) e.stopPropagation();

  const formFieldName = document.getElementById("combo-input-name") && document.getElementById("combo-input-name").value;
  const regularFont = document.getElementById("combo-font-style") && document.getElementById("combo-font-style").value;

  fontStyle = generateFontName("combo-font-style");
  fontSize = document.getElementById("combo-font-size") && parseInt(document.getElementById("combo-font-size").value);
  textColor = document.getElementById("combo-font-color") && document.getElementById("combo-font-color").value;
  textBackgroundColor = document.getElementById("combo-font-background-color") && document.getElementById("combo-font-background-color").value;
  borderColor = document.getElementById("combo-border-color") && document.getElementById("combo-border-color").value;
  borderWidth = document.getElementById("combo-border-width") && document.getElementById("combo-border-width").value;

  let initialValue = comboboxOptionArray[0];
  const currentFormText = document.getElementById(`combo${current_form_id}`);
  if (currentFormText) {
    let currentValue = currentFormText.querySelector(".combobox-field-input").value;
    if (currentValue != "") initialValue = currentValue;
  }

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if (!isEditing) {
        if (!isOpenEmailPdf) {
          form_storage[i].optionArray =
            form_storage[i].optionArray.concat(comboboxOptionArray);
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;
          form_storage[i].regularFontStyle = regularFont;
          form_storage[i].textBackgroundColor = textBackgroundColor;
          form_storage[i].borderColor = borderColor;
          form_storage[i].borderWidth = borderWidth;
          form_storage[i].form_field_name = formFieldName;

          comboboxOptionArray = [];

          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        } else {
          form_storage[i].initialValue = initialValue;
        }
      } else {
        form_storage[i].initialValue = initialValue;
      }
    }
  }

  let count = 0;

  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "combo" + baseId,
      form_type: COMBOBOX,
      form_field_name: formFieldName,
      initialValue: initialValue,
      page_number: PDFViewerApplication.page,
      optionArray: comboboxOptionArray,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      fontSize: fontSize,
      textColor: textColor,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    textBackgroundColor = "";
    borderColor = "";
    borderWidth = "";

    alignValue = 0;
    comboboxOptionArray = [];
    const date = new Date(Date.now());
    addHistory(baseId, COMBOBOX, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "combo");
  }
  document
    .getElementById("combo-save-button")
    .removeEventListener("click", handleCombo);
};
// When click "Save" button, save the information of Listbox element.

const handleList = function (e) {
  if (document.getElementById(LIST_OPTION)) document.getElementById(LIST_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("list-input-name") && document.getElementById("list-input-name").value;
  const regularFont = document.getElementById("list-font-style") && document.getElementById("list-font-style").value;

  fontStyle = document.getElementById("list-font-style") && document.getElementById("list-font-style").value;
  fontSize = document.getElementById("list-font-size") && parseInt(document.getElementById("list-font-size").value);
  textColor = document.getElementById("list-font-color") && document.getElementById("list-font-color").value;
  textBackgroundColor = document.getElementById("list-font-background-color") && document.getElementById("list-font-background-color").value;
  borderColor = document.getElementById("list-border-color") && document.getElementById("list-border-color").value;
  borderWidth = document.getElementById("list-border-width") && document.getElementById("list-border-width").value;

  let initialValue = "";
  const currentFormText = document.getElementById(`list${current_form_id}`);
  if (currentFormText) {
    if (currentFormText.querySelector(".list-field-input").querySelector(".active"))
      initialValue = currentFormText.querySelector(".list-field-input").querySelector(".active").textContent;
  }

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if (!isEditing) {
        if (!isOpenEmailPdf) {
          form_storage[i].optionArray =
            form_storage[i].optionArray.concat(listboxOptionArray);
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;
          form_storage[i].regularFontStyle = regularFont;
          form_storage[i].textBackgroundColor = textBackgroundColor;
          form_storage[i].borderColor = borderColor;
          form_storage[i].borderWidth = borderWidth;
          form_storage[i].form_field_name = formFieldName;

          listboxOptionArray = [];

          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        } else {
          form_storage[i].initialValue = initialValue;
        }
      } else {
        form_storage[i].initialValue = initialValue;
      }
    }
  }

  let count = 0;

  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "list" + baseId,
      form_type: LIST,
      form_field_name: formFieldName,
      page_number: PDFViewerApplication.page,
      initialValue: initialValue,
      optionArray: listboxOptionArray,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      fontSize: fontSize,
      textColor: textColor,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    textBackgroundColor = "";
    borderColor = "";
    borderWidth = "";

    alignValue = 0;
    listboxOptionArray = [];
    const date = new Date(Date.now());
    addHistory(baseId, LIST, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "list");
  }
  document
    .getElementById("list-save-button")
    .removeEventListener("click", handleList);
};

// Display 4 points around the canvas to resize the canvas - top, left, right, bottom.
const addResizebar = function (objectId) {
  const topLeft = document.createElement("div");
  topLeft.id = "topLeft";
  topLeft.classList.add("resize-point");
  topLeft.classList.add("top-left");
  topLeft.classList.add("resize-l");
  topLeft.classList.add("resize-t");
  const top = document.createElement("div");
  top.id = "top";
  top.classList.add("resize-point");
  top.classList.add("top-center");
  top.classList.add("resize-t");
  const topRight = document.createElement("div");
  topRight.id = "topRight";
  topRight.classList.add("resize-point");
  topRight.classList.add("top-right");
  topRight.classList.add("resize-r");
  topRight.classList.add("resize-t");
  const left = document.createElement("div");
  left.id = "left";
  left.classList.add("resize-point");
  left.classList.add("middle-left");
  left.classList.add("resize-l");
  const right = document.createElement("div");
  right.id = "right";
  right.classList.add("resize-point");
  right.classList.add("middle-right");
  right.classList.add("resize-r");
  const bottomLeft = document.createElement("div");
  bottomLeft.id = "bottomLeft";
  bottomLeft.classList.add("resize-point");
  bottomLeft.classList.add("bottom-left");
  bottomLeft.classList.add("resize-l");
  bottomLeft.classList.add("resize-b");
  const bottom = document.createElement("div");
  bottom.id = "bottom";
  bottom.classList.add("resize-point");
  bottom.classList.add("bottom-center");
  bottom.classList.add("resize-b");
  const bottomRight = document.createElement("div");
  bottomRight.id = "bottomRight";
  bottomRight.classList.add("resize-point");
  bottomRight.classList.add("bottom-right");
  bottomRight.classList.add("resize-r");
  bottomRight.classList.add("resize-b");
  const container = document.getElementById(objectId);
  if (container) {
    container.classList.add('border-resizebar');
    container.append(
      top,
      left,
      right,
      bottom,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    );
  }
};

const removeResizebar = function (objectId) {
  const container = document.getElementById(objectId);
  container.classList.remove('border-resizebar');
  const resizePoints = [
    "topLeft",
    "top",
    "topRight",
    "left",
    "right",
    "bottomLeft",
    "bottom",
    "bottomRight",
  ];
  if (container) {
    resizePoints.forEach((item) => {
      let childElement = document.getElementById(item);
      if (container.querySelector(`#${item}`)) {
        container.removeChild(childElement);
      }
    });
  } else {
    console.log("Parent element not found");
  }
};

// Show the OptionPane to edit the properties of elements.

const showOption = function (id, x, y) {
  const fieldOption = document.getElementById(id);

  if (fieldOption) {
    if (isOptionPane) fieldOption.style.display = "flex";
    else fieldOption.style.display = "none";

    fieldOption.style.top = `${y + 5}` + "px";
    fieldOption.style.left = x + "px";

    return fieldOption;
  } else return null;
};

// When click "Save" button, save the information of Button element.
const handleButton = function (e) {
  isOptionPane = false;
  if (document.getElementById(BUTTON_OPTION)) document.getElementById(BUTTON_OPTION).style.display = "none";
  let form_action = 0;
  const selectedValue = document.getElementById("button-field-input-action") && document.getElementById("button-field-input-action").value;
  if (selectedValue === "submit") {
    form_action = SUBMIT;
  } else if (selectedValue === "reset") {
    form_action = RESET;
  } else if (selectedValue === "no_action") {
    form_action = NOACTION;
  }
  if (e) e.stopPropagation();

  const formFieldName = document.getElementById("button-field-input-name") && document.getElementById("button-field-input-name").value;
  let initialValue = document.getElementById("button-text") && document.getElementById("button-text").value;
  fontStyle = document.getElementById("button-font-style") && document.getElementById("button-font-style").value;
  fontSize = document.getElementById("button-font-size") && parseInt(document.getElementById("button-font-size").value);
  textColor = document.getElementById("button-font-color") && document.getElementById("button-font-color").value;
  textBackgroundColor = document.getElementById("button-font-background-color") && document.getElementById("button-font-background-color").value;
  borderColor = document.getElementById("button-border-color") && document.getElementById("button-border-color").value;
  borderWidth = document.getElementById("button-border-width") && document.getElementById("button-border-width").value;

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if (!isEditing) {
        if (!isOpenEmailPdf) {
          form_storage[i].action = form_action;
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;
          form_storage[i].text = initialValue;
          form_storage[i].align = alignValue;
          form_storage[i].textBackgroundColor = textBackgroundColor;
          form_storage[i].borderColor = borderColor;
          form_storage[i].borderWidth = borderWidth;
          form_storage[i].form_field_name = formFieldName;

          //... handle track
          handleTrack(form_storage[i].id, initialValue + " Type " + selectedValue);
          break;
        } else {
          form_storage[i].text = initialValue;
        }
      } else {
        form_storage[i].text = initialValue;
      }
    }
  }

  let count = 0;

  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "button" + baseId,
      form_type: BUTTON,
      form_field_name: formFieldName,
      text: initialValue,
      action: form_action,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      fontSize: fontSize,
      textColor: textColor,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    textBackgroundColor = "";
    borderColor = "";
    borderWidth = "";

    alignValue = 0;
    form_action = 0;
    const date = new Date(Date.now());
    addHistory(baseId, BUTTON, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "button");
  }

  if (document.getElementById("button-save-button")) document.getElementById("button-save-button").removeEventListener("click", handleButton);
};

const handleDate = function (e) {
  let text;
  const currentText = document.getElementById(current_date_content_id);
  if (currentText) text = currentText.value;
  isOptionPane = false;
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("date-input-name") && document.getElementById("date-input-name").value;
  fontStyle = generateFontName("date-font-style");
  fontSize = document.getElementById("date-font-size") && parseInt(document.getElementById("date-font-size").value);
  textColor = document.getElementById("date-font-color") && document.getElementById("date-font-color").value;
  textBackgroundColor = document.getElementById("date-font-background-color") && document.getElementById("date-font-background-color").value;
  borderColor = document.getElementById("date-border-color") && document.getElementById("date-border-color").value;
  borderWidth = document.getElementById("date-border-width") && document.getElementById("date-border-width").value;

  const regularFont = document.getElementById("date-font-style") && document.getElementById("date-font-style").value;

  if (window.getComputedStyle(document.getElementById(DATE_OPTION)).getPropertyValue('display') !== "none") {
    document.getElementById(DATE_OPTION).style.display = "none";
  }

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if (!isEditing) {
        if (!isOpenEmailPdf) {
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;
          form_storage[i].text = text;
          form_storage[i].textBackgroundColor = textBackgroundColor;
          form_storage[i].borderColor = borderColor;
          form_storage[i].borderWidth = borderWidth;
          form_storage[i].form_field_name = formFieldName;

          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        } else {
          form_storage[i].text = text;
        }
      } else {
        form_storage[i].text = text;
      }
    }
  }

  let count = 0;
  for (let j = 0; j < form_storage.length; j++) {
    if (form_storage[j].id != current_form_id) count++;
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {
    form_storage.push({
      id: baseId,
      containerId: "datecontent" + baseId,
      form_type: DATE,
      form_field_name: formFieldName,
      page_number: PDFViewerApplication.page,
      text: text,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      fontStyle: fontStyle,
      regularFontStyle: regularFont,
      fontSize: fontSize,
      baseFontSize: fontSize,
      textColor: textColor,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,

      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";
    textBackgroundColor = "";
    borderColor = "";
    borderWidth = "";

    const date = new Date(Date.now());
    addHistory(baseId, DATE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "date");
  }
  document
    .getElementById("date-save-button")
    .removeEventListener("click", handleDate);
};

const handleSignature = function () {
  textBackgroundColor = document.getElementById("signature-background-color") && document.getElementById("signature-background-color").value;
  borderColor = document.getElementById("signature-border-color") && document.getElementById("signature-border-color").value;
  borderWidth = document.getElementById("signature-border-width") && document.getElementById("signature-border-width").value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].textBackgroundColor = textBackgroundColor;
      form_storage[i].borderColor = borderColor;
      form_storage[i].borderWidth = borderWidth;
      form_storage[i].imgData = signatureImgData;

      if(signatureImgData != "" && signatureImgData != undefined){
        getImgHeight(signatureImgData).then(function(e){
          form_storage[i].width = e.width * 0.3;
          form_storage[i].height = e.height * 0.3;
        })
      }
      break;
    }
  }
  let signStorage = form_storage.filter(function (item) {
    return item.form_type == SIGNATURE;
  });
  let count = 0;
  for (let j = 0; j < signStorage.length; j++) {
    if (
      signStorage[j].id != current_form_id
    )
      count++;
  }

  textBackgroundColor = document.getElementById("signature-font-background-color") && document.getElementById("signature-font-background-color").value;
  borderColor = document.getElementById("signature-border-color") && document.getElementById("signature-border-color").value;
  borderWidth = document.getElementById("signature-border-width") && document.getElementById("signature-border-width").value;

  // if (isDraft == "true" && isOpenEmailPdf) {
  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      form_storage[i].textBackgroundColor = textBackgroundColor;
      form_storage[i].borderColor = borderColor;
      form_storage[i].borderWidth = borderWidth;

      let sign_type = $(".signature-option .tablink-active").text();

      //... handle track
      handleTrack(form_storage[i].id, sign_type + " signature");
      break;
    }
  }

  if (baseId !== 0 && (count == signStorage.length || signStorage == null)) {
    form_storage.push({
      id: baseId,
      containerId: "signature" + baseId,
      form_type: SIGNATURE,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
      imgData: signatureImgData,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,
    });
    const date = new Date(Date.now());
    addHistory(baseId, SIGNATURE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "signature");
  }
};

const handlePhoto = function () {
  textBackgroundColor = document.getElementById("photo-background-color") && document.getElementById("photo-background-color").value;
  borderColor = document.getElementById("photo-border-color") && document.getElementById("photo-border-color").value;
  borderWidth = document.getElementById("photo-border-width") && document.getElementById("photo-border-width").value;
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].textBackgroundColor = textBackgroundColor;
      form_storage[i].borderColor = borderColor;
      form_storage[i].borderWidth = borderWidth;
      form_storage[i].photoData = photoData;

      if(photoData != "" && photoData != undefined){
        getImgHeight(photoData).then(function(e){
          form_storage[i].width = e.width * 0.3;
          form_storage[i].height = e.height * 0.3;
        })
      }
      break;
    }
  }

  let imageStorage = form_storage.filter(function (item) {
    return item.form_type == PHOTO;
  });
  let count = 0;
  for (let j = 0; j < imageStorage.length; j++) {
    if (
      imageStorage[j].id != current_form_id
    )
      count++;
  }

  textBackgroundColor = document.getElementById("photo-background-color") && document.getElementById("photo-background-color").value;
  borderColor = document.getElementById("photo-border-color") && document.getElementById("photo-border-color").value;
  borderWidth = document.getElementById("photo-border-width") && document.getElementById("photo-border-width").value;

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      form_storage[i].textBackgroundColor = textBackgroundColor;
      form_storage[i].borderColor = borderColor;
      form_storage[i].borderWidth = borderWidth;
      handleTrack(form_storage[i].id, " photo");
      break;
    }
  }

  if (baseId !== 0 && (count == imageStorage.length || imageStorage == null)) {
    form_storage.push({
      id: baseId,
      containerId: "photo" + baseId,
      form_type: PHOTO,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
      photoData: photoData,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,
    });
    const date = new Date(Date.now());
    addHistory(baseId, PHOTO, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "photo");
  }
};

const handleNumber = function (e) {
  isOptionPane = false;
  if (document.getElementById(NUMBERFIELD_OPTION)) document.getElementById(NUMBERFIELD_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  const formFieldName = document.getElementById("number-field-input-name") && document.getElementById("number-field-input-name").value;
  const regularFont = document.getElementById("number-font-style") && document.getElementById("number-font-style").value;

  fontStyle = generateFontName("number-font-style");
  fontSize = document.getElementById("number-font-size") && parseInt(document.getElementById("number-font-size").value);
  textColor = document.getElementById("number-font-color") && document.getElementById("number-font-color").value;
  textBackgroundColor = document.getElementById("number-font-background-color") && document.getElementById("number-font-background-color").value;
  borderColor = document.getElementById("number-border-color") && document.getElementById("number-border-color").value;
  borderWidth = document.getElementById("number-border-width") && document.getElementById("number-border-width").value;

  var selectedAlign = document.querySelector('input[type=radio][name="number-field"]:checked') && document.querySelector('input[type=radio][name="number-field"]:checked').value;
  if (selectedAlign == "left") {
    alignValue = ALIGN_LEFT;
  } else if (selectedAlign == "center") {
    alignValue = ALIGN_CENTER;
  } else if (selectedAlign == "right") {
    alignValue = ALIGN_RIGHT;
  }

  const numberCount = document.getElementById("count") && document.getElementById("count").value;

  let initialValue = "";
  const currentFormText = $(`#number${current_form_id}`);  
  
  if ($(currentFormText)) {
    $(currentFormText).find('.number-field-input').each(function() {
      var val = $(this).val() === "" ? "-" : $(this).val();
      initialValue = initialValue + val;
    });
  }

  formWidth = 30;
  formHeight = 40;

  for (let i = 0; i < form_storage.length; i++) {
    if (form_storage[i].id == current_form_id) {
      if (!isEditing) {
        if (!isOpenEmailPdf) {
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;
          form_storage[i].align = alignValue;
          form_storage[i].isBold = isBold;
          form_storage[i].isItalic = isItalic;
          form_storage[i].isUnderline = isUnderline;
          form_storage[i].regularFontStyle = regularFont;
          form_storage[i].textBackgroundColor = textBackgroundColor;
          form_storage[i].borderColor = borderColor;
          form_storage[i].borderWidth = borderWidth;
          form_storage[i].form_field_name = formFieldName;
          form_storage[i].count = numberCount;
          form_storage[i].initialValue = initialValue;
  
          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        } else {
          form_storage[i].initialValue = initialValue;
        }
      } else {
        form_storage[i].initialValue = initialValue;
      }
    }
  }

  let count = 0;

  for (let j = 0; j < form_storage.length; j++) {
    if (
      form_storage[j].form_field_name != formFieldName &&
      form_storage[j].id != current_form_id
    )
      count++;
  }

  // if (baseId !== 0 && (count == form_storage.length || form_storage == null)) {
  if (baseId !== 0 && count == form_storage.length) {    
    form_storage.push({
      id: baseId,
      containerId: "number" + baseId,
      form_type: NUMBERFIELD,
      form_field_name: formFieldName,
      initialValue: initialValue,
      page_number: PDFViewerApplication.page,
      x: pos_x_pdf,
      y: pos_y_pdf,
      baseX: pos_x_pdf,
      baseY: pos_y_pdf,
      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      fontStyle: fontStyle,
      regularFontStyle: regularFont,
      isBold: isBold,
      isItalic: isItalic,
      isUnderline: isUnderline,
      fontSize: fontSize,
      textColor: textColor,
      textBackgroundColor: textBackgroundColor,
      borderColor: borderColor,
      borderWidth: borderWidth,
      count: numberCount,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });

    fontStyle = "";
    fontSize = 12;
    textColor = "";
    textBackgroundColor = "";
    borderColor = "";
    borderWidth = "";

    const date = new Date(Date.now());
    addHistory(baseId, NUMBERFIELD, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "number");
  }

  document
    .getElementById("number-save-button")
    .removeEventListener("click", handleNumber);
  removeBoldItalicEvent();
};

// Resize and move canvas using Interact.js library.
const resizeCanvas = function (id, type, currentId, optionId) {  
  let newX = 0,
    newY = 0;

  DrawType = type;
  const interactInstance = interact(`#${id}`)

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

          resizeHandler(event.rect.width, event.rect.height, currentId);
          showOption(
            optionId,
            event.rect.width / 2 - 180,
            event.rect.height + 15
          );
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
          if (DrawType === RADIO) {
            form_storage.map(function (item) {
              if (item.id === parseInt(currentId)) {
                if (item.data.baseX && item.data.baseY) {
                  let posXpdf = item.data.baseX + x * 0.75 * 0.8;
                  let posYpdf =
                    item.data.baseY - y * 0.75 * 0.8 - item.data.height;
                  if (posXpdf < 0) {
                    newX = 0 - item.data.baseX / 0.75 / 0.8;
                  } else if (posXpdf + item.data.width >= pageWidth) {
                    newX =
                      (pageWidth - item.data.width - item.data.baseX) /
                      0.75 /
                      0.8;
                  } else newX = x;
                  if (posYpdf < 0) {
                    newY = (item.data.baseY - item.data.height) / 0.75 / 0.8;
                  } else if (posYpdf + item.data.height >= pageHeight) {
                    newY = (item.data.baseY - pageHeight) / 0.75 / 0.8;
                  } else newY = y;
                }
              }
            });
          } else if (DrawType === TEXT_CONTENT) {
            text_storage.map(function (item) {
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
          } else if (DrawType === COMMENT) {
            comment_storage.map(function (item) {
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
          } else {
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
          }
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
};

function drawCrossLines(target) {
  $(".horizontal-line, .vertical-line").remove();

  const rect = target.getBoundingClientRect();
  const scrollTop = $(window).scrollTop();
  const scrollLeft = $(window).scrollLeft();
  const windowHeight = $(window).height();
  const windowWidth = $(window).width();

  const $horizontalLine = $('<div>').addClass('line horizontal-line');
  $horizontalLine.css({
    'top': `${rect.top + scrollTop}px`, // Y-coordinate of the element relative to the document
    'left': '0px',
    'width': `${windowWidth + scrollLeft}px`,
    'height': '2px'
  });
  $('body').append($horizontalLine);

  const $verticalLine = $('<div>').addClass('line vertical-line');
  $verticalLine.css({
    'left': `${rect.left + scrollLeft}px`, // X-coordinate of the element relative to the document
    'top': '0px',
    'height': `${windowHeight + scrollTop}px`,
    'width': '2px'
  });
  $('body').append($verticalLine);
}

const saveFormElementByClick = function () {
  const elementsToRemove = [
    document.getElementById(`checkbox_tooltipbar${current_form_id}`),
    document.getElementById(`radio_tooltipbar${current_form_id}`),
    document.getElementById(`text_tooltipbar${current_form_id}`),
    document.getElementById(`combo_tooltipbar${current_form_id}`),
    document.getElementById(`list_tooltipbar${current_form_id}`),
    document.getElementById(`button_tooltipbar${current_form_id}`),
    document.getElementById(`date_tooltipbar${current_form_id}`),
    document.getElementById(`text-content_tooltipbar${current_text_num_id}`),
    document.getElementById(`shape_tooltipbar${current_form_id}`),
    document.getElementById(`photo_tooltipbar${current_form_id}`),
    document.getElementById(`number_tooltipbar${current_form_id}`)
  ];
  const optionElements = [checkboxOption, radioOption, textFieldOption, comboOption, listOption, buttonOption, dateOption, textContentOption, photoOption, numberFieldOption];
  const handlers = [handleCheckbox, handleRadio, handleText, handleCombo, handleList, handleButton, handleDate, handleTextContent, handlePhoto, handleNumber];

  for (let i = 0; i < optionElements.length; i++) {
    if (window.getComputedStyle(optionElements[i]).getPropertyValue('display') !== "none") {
      handlers[i]();
    }
  }
  elementsToRemove.forEach(element => {
    if (element) {
      element.remove();
    }
  });
  if (form_storage && form_storage.length != 0) {
    form_storage.forEach((item) => {
      let currentItem = document.getElementById(item.containerId);
      if (currentItem) {
        currentItem.style.zIndex = standardZIndex;
        if (currentItem.classList.contains("textfield-content"))
          currentItem.classList.remove("textfield-content");
      }
    })
  }
  if (text_storage && text_storage.length != 0) {
    text_storage.forEach((item) => {
      let currentItem = document.getElementById(item.containerId);
      if (currentItem) {
        currentItem.style.zIndex = standardZIndex;
        if (currentItem.classList.contains("textfield-content"))
          currentItem.classList.remove("textfield-content");
      }
    })
  }
}

const removeAllResizeBar = function () {
  if (form_storage  && form_storage !== null) {
    form_storage.forEach((item) => {
      let currentItem;
      if (item.form_type === DATE) currentItem = document.getElementById(item.containerId) && document.getElementById(item.containerId).parentElement;
      else currentItem = document.getElementById(item.containerId);
      if (currentItem && currentItem.querySelector("#topLeft")) {
        removeResizebar(currentItem.id);
      }
    })
  }
  if (text_storage  && text_storage !== null) {
    text_storage.forEach((item) => {
      const currentItem = document.getElementById(item.containerId);
      if (currentItem && currentItem.querySelector("#topLeft")) removeResizebar(currentItem.id);
    })
  }
  if (comment_storage !== null) {
    comment_storage.forEach((item) => {
      const currentItem = document.getElementById(item.containerId);
      if (currentItem && currentItem.querySelector("#topLeft")) removeResizebar(currentItem.id);
    })
  }
}

const handleComment = function (id, type) {
  const baseId = extractNumbersAsString(id);
  showHistoryBar.querySelectorAll(".add-reply").forEach(reply => {
    reply.style.display = "none";
  });
  showHistoryBar.querySelectorAll(".historyComment").forEach(comment => {
    comment.style.display = "none";
  });
  document.getElementById(`addReply${baseId}`).style.display = "flex";
  if (document.getElementById(`historyMainPart${baseId}`).hasChildNodes()) document.getElementById(`historyComment${baseId}`).style.display = "flex";
  if (type !== TEXTFIELD && type !== TEXT_CONTENT && type !== NUMBERFIELD) {
    document.getElementById(`replyInput${baseId}`).focus();
  }
}

viewer.addEventListener("mousedown", function (event) {
  let isExisting = false;
  let optionCount = 0;
  let currentFormType, currentObject;
  currentObject = event.target;
  let deleteButton = document.querySelector(".fa-trash-can");
  let currentObjectParentId = '';
  if (currentObject) {
    let parentElement = currentObject.parentNode;
    if (parentElement) {
      currentObjectParentId = parentElement.id;
    }
  }
  if (form_storage  && form_storage !== null) {
    form_storage.forEach((item) => {
      const cId = item.form_type === DATE ? item.containerId.replace("content", "") : item.containerId;
      if (cId === currentObject.id || cId === currentObjectParentId) {
        currentFormType = item.form_type;
        DrawType = item.form_type;
        isExisting = true;
      }
      document.getElementById(cId).style.zIndex = standardZIndex;
    })
  }
  
  
  if (text_storage  && text_storage !== null) {
    text_storage.forEach((item) => {
      if (item.textContentId === currentObject.id) {
        currentFormType = item.form_type;
        DrawType = item.form_type;
        isExisting = true;
      }
    })
  }

  if (isExisting) {
    if (!isEditing) {
      event.preventDefault();
      removeAllResizeBar();
      saveFormElementByClick();      
      if (currentFormType === DATE) {
        // currentObject.style.zIndex = selectedZIndex;
      } else if (currentFormType === SIGNATURE || currentFormType === PHOTO) {
        if (currentObject.tagName === "IMG") {
          if (!currentObject.parentElement.querySelector("#topLeft")) addResizebar(currentObject.parentElement.id);
          currentObject.parentElement.style.zIndex = selectedZIndex;
        } else {
          if (!currentObject.querySelector("#topLeft")) addResizebar(currentObject.id);
          // currentObject.style.zIndex = selectedZIndex;
        }
      } else if (currentFormType === SHAPE) {
        // currentObject.style.zIndex = "auto";
      } else if (currentFormType == TEXT_CONTENT) {
        if (!currentObject.parentElement.classList.contains("textfield-content"))
          currentObject.parentElement.classList.add("textfield-content");
        // currentObject.style.zIndex = standardZIndex;
      } else {
        if (!currentObject.querySelector("#topLeft")) addResizebar(currentObject.id);
        currentObject.style.zIndex = selectedZIndex;
      }
      // handleComment(currentObject.id, currentFormType);
    } else {
      handleEditMode(current_form_id);
    }
  } else {
    if (deleteButton && (currentObject == deleteButton || currentObject == deleteButton.parentElement)) {

    } else {
      removeAllResizeBar();
      optionIdArray.forEach((item) => {
        if (document.getElementById(item)) {
          if (document.getElementById(item).contains(currentObject)) {
            optionCount++;
          }
        }
      })
      if (optionCount == 0) saveFormElementByClick();
    }
  }
});

const resizeHandler = function (width, height, currentId) {
  if (DrawType == RADIO) {
    form_storage.map(function (item) {
      if (item.id === parseInt(currentId)) {
        item.data.width = width * 0.75 * 0.8;
        item.data.height = height * 0.75 * 0.8;
        item.data.xPage = width;
        item.data.yPage = height;
      }
    });
  } else if (DrawType == TEXT_CONTENT) {
    text_storage.map(function (item) {
      if (item.id === currentId) {
        item.width = width * 0.75 * 0.8;
        item.height = height * 0.75 * 0.8;
        item.xPage = width;
        item.yPage = height;
      }
    });
  } else {
    switch (DrawType) {
      case CHECKBOX:
        const checkbox = document.getElementById(`checkbox${currentId}`);
        const parentCheckWidth = checkbox.offsetWidth;
        const parentCheckHeight = checkbox.offsetHeight;
        const newCheckmarkSize =
          Math.min(parentCheckWidth, parentCheckHeight) * 0.8;
        checkbox.style.setProperty("--checkmark-size", newCheckmarkSize + "px");
        break;
      default:
        break;
    }
    form_storage.map(function (item) {
      if (item.id === parseInt(currentId)) {
        item.width = width * 0.75 * 0.8;
        item.height = height * 0.75 * 0.8;
        item.xPage = width;
        item.yPage = height;
      }
    });
  }
};

function hexToRgb(hex) {
  const int = parseInt(hex.slice(1), 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return PDFLib.rgb(r / 255, g / 255, b / 255);
}

const hexToRgbNew = function (hex) {
  hex = hex.replace(/^#/, '');

  // Parse the hex color components
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return PDFLib.rgb(r / 255, g / 255, b / 255);
}

async function imageUrlToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Show the specified OptionPane and add resizebar.
const showOptionAndResizebar = function (
  optionId,
  object,
  objectWidth,
  objectHeight,
  id
) {
  isOptionPane = true;
  let option = showOption(optionId, objectWidth / 2 - 180, objectHeight + 15);
  removeParentEvent(optionId);
  // addResizebar(object.id);
  object.append(option);
  if (optionId != CHECKBOX_OPTION && optionId != RADIO_OPTION) {
    let selectStyleContent = "";
    let selectSizeContent = "";
    fontStyleArr.map((item) => {
      selectStyleContent += `<option value=${item} style="font-family: ${item}">${item}</option>`;
    });
    fontSizeArr.map((item) => {
      if (item == "Auto")
        selectSizeContent += `<option value='12'>Default</option>`;
      else selectSizeContent += `<option value=${item}>${item}</option>`;
    });
    if (document.getElementById(`${id}-font-style`)) {
      document.getElementById(`${id}-font-style`).innerHTML = selectStyleContent;
    }
    if (document.getElementById(`${id}-font-size`)) {
      document.getElementById(`${id}-font-size`).innerHTML = selectSizeContent;
    }
    if (document.getElementById(`${id}-font-color`)) {
      document.getElementById(`${id}-font-color`).value = "#000000";
    }
    if (document.getElementById(`${id}-font-background-color`)) {
      document.getElementById(`${id}-font-background-color`).value = "#FFFFFF";
    }
    if (document.getElementById(`${id}-left`)) {
      document.getElementById(`${id}-left`).checked = true;
    }
    if (document.getElementById(`count`)) {
      document.getElementById(`count`).value = 1;
    }
  } else {
    if (document.getElementById(`${id}-background-color`)) {
      document.getElementById(`${id}-background-color`).value = "#FFFFFF";
    }
  }

  let borderSizeContent = "";
  borderSizeArr.map((item) => {
    borderSizeContent += `<option value="${item}" ${item === 1 ? 'selected' : ''}>${item}</option>`;
  });
  if (document.getElementById(`${id}-border-width`)) {
    document.getElementById(`${id}-border-width`).innerHTML = borderSizeContent;
  };
  let colorContent = "";
  colorArr.map((item) => {
    var img = item === "transparent" ? `<img src="./images/no-color.png" alt="no color" width="20" />` : "";
    var noColor = item === "transparent" ? "noColor" : "";
    colorContent += `<div color="${item}" style="background-color: ${item}" class="color-container ${noColor}" onClick='changeFillColor("${id}", "${item}")'>${img}</div>`;
  })
  if (document.getElementById(`${id}-fill-colors`)) {
    document.getElementById(`${id}-fill-colors`).innerHTML = colorContent;
  };
};

const showFillColor = (id) => {
  const fillColorsContainer = document.getElementById(`${id}-fill-colors`);
  fillColorsContainer.classList.toggle("hidden");
}

const changeFillColor = (id, selectedColor) => {
  const activeFillColorContainer = document.querySelector(".active-fill-color");
  if (selectedColor === "transparent") {
    activeFillColorContainer.style.backgroundColor = "transparent";
    activeFillColorContainer.innerHTML = `<img src="./images/no-color.png" alt="no color" width="20" />`;
    activeFillColorContainer.classList.add("noColor");
  } else {
    activeFillColorContainer.style.backgroundColor = selectedColor;
    activeFillColorContainer.innerHTML = "";
    activeFillColorContainer.classList.remove("noColor");
  }

  document.querySelectorAll(".color-container").forEach(container => {
    container.classList.remove("active");
  });

  const selectedContainer = document.querySelector(`.color-container[color='${selectedColor}']`);
  if (selectedContainer) {
    selectedContainer.classList.add("active");
  }

  const fillColorsContainer = document.getElementById(`${id}-fill-colors`);
  fillColorsContainer.classList.add("hidden");
}

// Add Delete button and define action.
const addDeleteButton = function (currentId, container, object, type) {
  container.id = `${type}_tooltipbar` + currentId;
  container.style.position = "absolute";
  container.style.zIndex = standardZIndex;
  container.style.top = "-42px";
  container.style.left = "0px";
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.alignItems = "center";
  container.style.gap = "5px";
  container.style.height = "30px";
  container.classList.add("delete-button");
  let deleteBtn = document.createElement("button");
  deleteBtn.style.padding = "5px";
  deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`;

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    let currentObject;

    const target = document.getElementById(`${type}` + currentId);
    if (target && document.getElementById("topLeft")) {
      removeResizebar(target.id);
    }

    if (target) {
      target.style.display = "none";
    }

    // Handle deletion of different types
    if (type === "text-content") {
      currentObject = text_storage.find((item) => item.id == currentId);
      text_storage = text_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
      text_storage = text_storage.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    } else if (type === "comment") {
      currentObject = comment_storage.find((item) => item.id == currentId);
      comment_storage = comment_storage.filter(function (comment) {
        return comment.id !== parseInt(currentId);
      });
      comment_storage = comment_storage.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    } else {
      currentObject = form_storage.find((item) => item.id == currentId);
      form_storage = form_storage.filter(function (item) {
        return item.id != currentId;
      });
      form_storage = form_storage.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    }
    if (currentObject) {
      const commentPageDiv = document.getElementById(`page${currentObject.page_number}`);
      const currentHistoryDiv = document.getElementById(`historyDiv${currentId}`);
      if (commentPageDiv && commentPageDiv.contains(currentHistoryDiv)) {
        commentPageDiv.removeChild(currentHistoryDiv);
      }
    }
  });

  // Keyboard delete functionality
  document.addEventListener("keydown", (e) => {
    if (type !== "text-content" && e.key === "Delete") {
      currentId = container.id.replace(`${type}_tooltipbar`, "");
      const target = document.getElementById(`${type}` + currentId);
      if (target) {
        target.style.display = "none";
      }
      form_storage = form_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
      form_storage = form_storage.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    }
  });
  container.appendChild(deleteBtn);
  object.appendChild(container);
};

const resetCanvas = function () {
  const canvas = document
    .getElementById("signature-draw-body")
    .querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const addFormElementStyle = function (object, top, left, width, height, borderRadius="0") {  
  object.style.position = "absolute";
  object.style.top = top + "px";
  object.style.left = left + "px";
  object.style.width = width + "px";
  object.style.height = height + "px";
  object.style.background = "#78d3ff33";
  object.style.border = "1px solid #3c97fe80";
  object.style.zIndex = standardZIndex;
  object.tabIndex = 0;
  object.style.borderRadius = borderRadius == "0" ? "0px" : "3px";
  object.classList.add("form-fields");
};

//...
const addSignatureElementStyle = function (object, top, left, width, height) {
  object.style.position = "absolute";
  object.style.top = top + "px";
  object.style.left = left + "px";
  object.style.width = width + "px";
  object.style.height = height + "px";
  object.style.background = "#78d3ff33";
  // object.style.zIndex = standardZIndex;
  object.tabIndex = 0;
  object.style.borderRadius = "3px";
  object.classList.add("form-fields");
};

const addPhotoElementStyle = function (object, top, left, width, minHeight) {
  object.style.position = "absolute";
  object.style.top = top + "px";
  object.style.left = left + "px";
  object.style.width = width + "px";
  object.style.height = minHeight + "px";
  object.style.background = "#78d3ff33";
  // object.style.zIndex = standardZIndex;
  object.tabIndex = 0;
  object.style.borderRadius = "3px";
  object.classList.add("form-fields");
};

const removeFormElementStyle = function (id) {
  document.getElementById(id)
}

const toTransparent = function (object) {
  if (object) {
    object.style.border = "none";
    object.style.backgroundColor = "transparent";
  }
}

const submitAction = function () {
  form_storage.forEach((item) => {
    if (item.form_type === RADIO) {
      item.data.isReadOnly = true;
    } else {
      item.isReadOnly = true;
    }

    resizeCanvas(`${item.containerId}`);
    if (item.form_type == SHAPE) resizeCanvas(`${item.imgId}`);
    let currentItem;
    if (item.form_type != DATE) currentItem = document.getElementById(item.containerId);
    else currentItem = document.getElementById(item.containerId).parentElement;
    // toTransparent(currentItem);
    switch (item.form_type) {
      case CHECKBOX:
        break;
      case RADIO:
        // toTransparent(currentItem.querySelector(".radioinputchild"));
        // toTransparent(currentItem.querySelector(".checkmark-radio"));
        break;
      case TEXTFIELD:
        currentItem.querySelector(".text-field-input").disabled = true;
        break;
      case COMBOBOX:
        // toTransparent(currentItem.querySelector(".combobox-field-input"));
        currentItem.querySelector(".combobox-field-input").disabled = true;

        // currentItem.querySelector(".combobox-field-value").style.display = "block";
        // currentItem.querySelector(".combobox-field-value").textContent = item.initialValue;
        break;
      case LIST:
        // toTransparent(currentItem.querySelector(".list-field-input"));
        currentItem.querySelector(".list-field-input").querySelectorAll("p").forEach((pitem) => {
          // toTransparent(pitem);
          if (pitem.textContent != item.initialValue) pitem.remove();
        });
        break;
      case DATE:
        // toTransparent(currentItem.querySelector("input[type='date']"));
        currentItem.querySelector("input[type='date']").disabled = true;
        // currentItem.style.boxShadow = "none";
        break;
      case SIGNATURE:
        // resizeCanvas(`${item.imgId}`);
        break;
      case BUTTON:
        // currentItem.remove();
        break;
      case NUMBERFIELD:
        currentItem.querySelectorAll(".number-field-input").forEach(function(input) {
          input.disabled = true;
        });
        break;
      default:
        break;
    }
  })
  // form_storage = form_storage.filter((item) => {
  //   return item.form_type !== BUTTON;
  // })
  isSubmit = true;
}

// Handle the specified event.
const eventHandler = async function (e) {
  baseId++;
  let ost = computePageOffset();
  let x = e.pageX - ost.left;
  let y = e.pageY - ost.top;

  let pageId = String(PDFViewerApplication.page);
  let pg = document.getElementById(pageId);
  let topPos = y;
  let leftPos = x;

  displayFormProps();
  viewer.style.cursor = 'auto';

  switch (currentMode) {
    case CHECKBOX:
      removeCheckbox();

      let new_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = new_x_y[0];
      pos_y_pdf = new_x_y[1];

      let checkboxId = baseId;
      current_form_id = checkboxId;

      formWidth = 25;
      formHeight = 25;

      let checkbox = document.createElement("div");
      checkbox.id = "checkbox" + checkboxId;
      addFormElementStyle(
        checkbox,
        topPos,
        leftPos,
        formWidth,
        formHeight
      );
      let checkmark = document.createElement("div");
      checkmark.classList.add("checkmark", "form-container");
      checkmark.style.display = 'none';
      checkbox.classList.add("checkbox");
      checkbox.appendChild(checkmark);
      checkbox.onclick = function (e) {
        const checkedId = e.target.parentNode.id;
        current_form_id = checkedId.replace("checkbox", "");
        toggleCheckbox(checkedId);        
      };

      pg.appendChild(checkbox);

      showOptionAndResizebar(CHECKBOX_OPTION, checkbox, formWidth, formHeight, "checkbox");

      document.getElementById(
        "checkbox-field-input-name"
      ).value = `Checkbox Form Field ${checkboxCount++}`;
      document.getElementById(
        "checkbox-label"
      ).value = `Label ${checkboxCount}`;
      document.getElementById(
        "checkbox-value"
      ).value = `Value ${checkboxCount}`;

      current_checkbox_id = checkboxId;

      checkbox.addEventListener("dblclick", () => {
        if (!isEditing) {
          current_checkbox_id = checkboxId;          
          let istooltipshow = false;
          if (
            document.getElementById("checkbox_tooltipbar" + current_checkbox_id)
          ) {
            istooltipshow = true;
          }
          if (isDragging) {
            isDragging = false;
          } else {            
            if (!istooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = checkboxId;
              form_storage.map((element) => {
                if (element.id == checkboxId) {
                  document.getElementById("checkbox-field-input-name").value =
                    element.form_field_name;
                  document.getElementById("checkbox-label").value =
                    element.label;
                  document.getElementById("checkbox-value").value =
                    element.value;
                  document.getElementById("checkbox-background-color").value =
                    element.textBackgroundColor;

                  isOptionPane = true;
                  option = showOption(
                    CHECKBOX_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );

                  $(document).on("click", "#" + CHECKBOX_OPTION, function(){
                    document.getElementById(checkbox.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + CHECKBOX_OPTION, function(){
                    document.getElementById(checkbox.id).style.zIndex = selectedZIndex;
                  });
                  
                  checkbox.append(option);
                }
              });
              document
                .getElementById("checkbox-save-button")
                .addEventListener("click", handleCheckbox);
              addDeleteButton(
                current_checkbox_id,
                tooltipbar,
                checkbox,
                "checkbox"
              );
            } else {
              document
                .getElementById("checkbox_tooltipbar" + current_checkbox_id)
                .remove();
            }
          }
          document.getElementById(checkbox.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleCheckbox();

      document
        .getElementById("checkbox-save-button")
        .addEventListener("click", handleCheckbox);
      resizeCanvas(checkbox.id, CHECKBOX, checkboxId, CHECKBOX_OPTION);

      break;
    case RADIO:
      removeRadio();

      let radio_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = radio_x_y[0];
      pos_y_pdf = radio_x_y[1];

      let radioId = baseId;
      current_form_id = radioId;

      formWidth = 25;
      formHeight = 25;

      let radio = document.createElement("div");
      radio.id = "radio" + radioId;
      addFormElementStyle(radio, topPos, leftPos, formWidth, formHeight);
      radio.style.borderRadius = "50%";
      radio.classList.add("radio-container");

      let inputRadio = document.createElement("input");
      inputRadio.type = "radio";
      inputRadio.classList.add('radioinputchild', 'form-container');
      inputRadio.name = `Radio Group Form Field ${radioId}`;

      let spanElement = document.createElement("span");
      spanElement.classList.add("checkmark-radio", "form-container");

      inputRadio.style.display = "none";
      spanElement.style.display = "none";

      radio.append(inputRadio, spanElement);
      radio.onclick = function () {
        current_form_id = radioId;
        selectRadioButton(this, radioId);
      };

      pg.appendChild(radio);

      showOptionAndResizebar(RADIO_OPTION, radio, formWidth, formHeight, "radio")

      document.getElementById(
        "radio-field-input-name"
      ).value = `Radio Group Form Field ${radioId}`;
      document.getElementById("radio-label").value = `Label ${radioId}`;
      document.getElementById("radio-value").value = `Value ${radioId}`;
      current_radio_id = radioId;

      radio.addEventListener("dblclick", () => {
        if (!isEditing) {
          current_radio_id = radioId;

          let isradiotooltipshow = false;

          if (document.getElementById("radio_tooltipbar" + current_radio_id)) {
            isradiotooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!isradiotooltipshow) {
              let tooltipbar = document.createElement("div");

              current_form_id = radioId;
              form_storage.map((element) => {
                if (element.id == radioId) {
                  document.getElementById("radio-field-input-name").value =
                    element.data.option;
                  document.getElementById("radio-label").value =
                    element.data.label;
                  document.getElementById("radio-value").value =
                    element.data.value;
                  document.getElementById("radio-background-color").value =
                    element.textBackgroundColor;

                  isOptionPane = true;
                  option = showOption(
                    RADIO_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );

                  $(document).on("click", "#" + RADIO_OPTION, function(){
                    document.getElementById(radio.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + RADIO_OPTION, function(){
                    document.getElementById(radio.id).style.zIndex = selectedZIndex;
                  });

                  radio.append(option);
                }
              });

              document
                .getElementById("radio-save-button")
                .addEventListener("click", handleRadio);

              addDeleteButton(current_radio_id, tooltipbar, radio, "radio");

              radio.appendChild(tooltipbar);
            } else {
              document
                .getElementById("radio_tooltipbar" + current_radio_id)
                .remove();
            }
          }
          document.getElementById(radio.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleRadio();

      document
        .getElementById("radio-save-button")
        .addEventListener("click", handleRadio);
      resizeCanvas(radio.id, RADIO, radioId, RADIO_OPTION);

      break;
    case TEXTFIELD:
      removeText();

      let text_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = text_x_y[0];
      pos_y_pdf = text_x_y[1];

      let textId = baseId;
      current_form_id = textId;

      formWidth = 300;
      formHeight = 40;

      let textDiv = document.createElement("div");
      textDiv.id = "text" + textId;
      addFormElementStyle(textDiv, topPos, leftPos, formWidth, formHeight);

      let inputElement = document.createElement("input");
      inputElement.classList.add("text-field-input", "form-container");
      inputElement.style.display = "none";
      inputElement.addEventListener("input", function () {
        current_form_id = textId;
        handleText();
      });

      textDiv.append(inputElement);

      pg.appendChild(textDiv);

      // Show TextField OptionPane
      showOptionAndResizebar(
        TEXTFIELD_OPTION,
        textDiv,
        formWidth,
        formHeight,
        "text"
      );
      const textfieldAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      textfieldAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "text-field-input-name"
      ).value = `Text Form Field ${textfieldCount++}`;

      current_text_id = textId;

      textDiv.addEventListener("dblclick", () => {
        if (!isEditing) {
          current_text_id = textId;

          let istexttooltipshow = false;

          if (document.getElementById("text_tooltipbar" + current_text_id)) {
            istexttooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!istexttooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = textId;

              form_storage.map((element) => {
                if (element.id == textId) {
                  document.getElementById("text-field-input-name").value =
                    element.form_field_name;
                  isOptionPane = true;
                  option = showOption(
                    TEXTFIELD_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
                  document.getElementById("text-font-style").value =
                    element.fontStyle;
                  document.getElementById("text-font-size").value =
                    element.fontSize;
                  document.getElementById("text-font-color").value =
                    element.textColor;
                  document.getElementById("text-font-background-color").value =
                    element.textBackgroundColor;
                  document.getElementById("text-border-color").value =
                    element.borderColor;
                  document.getElementById("text-border-width").value =
                    element.borderWidth;

                  let selected = element.align;
                  if (selected == ALIGN_LEFT)
                    document.getElementById("text-left").checked = true;
                  if (selected == ALIGN_CENTER)
                    document.getElementById("text-center").checked = true;
                  if (selected == ALIGN_RIGHT)
                    document.getElementById("text-right").checked = true;

                  $(document).on("click", "#" + TEXTFIELD_OPTION, function(){
                    document.getElementById(textDiv.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + TEXTFIELD_OPTION, function(){
                    document.getElementById(textDiv.id).style.zIndex = selectedZIndex;
                  });

                  textDiv.append(option);
                }
              });

              document
                .getElementById("text-save-button")
                .addEventListener("click", handleText);

              addDeleteButton(current_text_id, tooltipbar, textDiv, "text");
            } else {
              document
                .getElementById("text_tooltipbar" + current_text_id)
                .remove();
            }
          }
          document.getElementById(textDiv.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleText();

      document
        .getElementById("text-save-button")
        .addEventListener("click", handleText);
      resizeCanvas(textDiv.id, TEXTFIELD, textId, TEXTFIELD_OPTION);

      break;
    case COMBOBOX:
      document.getElementById("option-content").innerHTML = "";
      removeCombo();

      let combo_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = combo_x_y[0];
      pos_y_pdf = combo_x_y[1];

      let comboId = baseId;
      current_form_id = comboId;

      formWidth = 300;
      formHeight = 40;

      let comboDiv = document.createElement("div");
      comboDiv.id = "combo" + comboId;
      addFormElementStyle(comboDiv, topPos, leftPos, formWidth, formHeight);

      let selectElement = document.createElement("select");
      selectElement.classList.add("combobox-field-input", "form-container");
      selectElement.style.display = "none";
      selectElement.addEventListener("change", function () {
        current_form_id = comboId;
        handleCombo();
      });

      comboDiv.append(selectElement);

      pg.appendChild(comboDiv);

      // Show Combobox OptionPane
      showOptionAndResizebar(
        COMBOBOX_OPTION,
        comboDiv,
        formWidth,
        formHeight,
        "combo"
      );
      const comboAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      comboAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "combo-input-name"
      ).value = `Combobox Form Field ${comboCount++}`;

      current_combo_id = comboId;

      comboDiv.addEventListener("dblclick", (e) => {
        if (!isEditing) {
          current_combo_id = comboId;

          let iscombotooltipshow = false;

          if (document.getElementById("combo_tooltipbar" + current_combo_id)) {
            iscombotooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!iscombotooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = comboId;
              document.getElementById("option-content").innerHTML = "";
              form_storage.map((element) => {
                if (element.id == comboId) {
                  document.getElementById("combo-input-name").value =
                    element.form_field_name;
                  isOptionPane = true;
                  option = showOption(
                    COMBOBOX_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
                  document.getElementById("combo-font-style").value =
                    element.fontStyle;
                  document.getElementById("combo-font-size").value =
                    element.fontSize;
                  document.getElementById("combo-font-color").value =
                    element.textColor;
                  document.getElementById("combo-font-background-color").value =
                    element.textBackgroundColor;
                  document.getElementById("combo-border-color").value =
                    element.borderColor;
                  document.getElementById("combo-border-width").value =
                    element.borderWidth;

                  element.optionArray.map((elementItem) => {
                    const optionContent = document.createElement("div");
                    const deleteDivId = `delete-span-${comboboxOptionCount}`;
                    optionContent.id = `comboOption${deleteDivId}`;
                    optionContent.className = "combobox-options-content";
                    const contentSpan = document.createElement("span");
                    contentSpan.textContent = elementItem;
                    const deleteSpan = document.createElement("span");
                    deleteSpan.className = "option-delete";
                    deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                    deleteSpan.addEventListener("click", function () {
                      // Remove the corresponding div when the delete span is clicked
                      element = element.optionArray.filter(function (item) {
                        return item !== elementItem;
                      });
                      optionContent.remove();
                    });
                    optionContent.append(contentSpan, deleteSpan);
                    document
                      .getElementById("option-content")
                      .append(optionContent);
                  });

                  $(document).on("click", "#" + COMBOBOX_OPTION, function(){
                    document.getElementById(comboDiv.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + COMBOBOX_OPTION, function(){
                    document.getElementById(comboDiv.id).style.zIndex = selectedZIndex;
                  });

                  comboDiv.append(option);
                }
              });

              document
                .getElementById("combo-save-button")
                .addEventListener("click", handleCombo);

              addDeleteButton(current_combo_id, tooltipbar, comboDiv, "combo");
            } else {
              // document
              //   .getElementById("combo_tooltipbar" + current_combo_id)
              //   .remove();
            }
          }
          document.getElementById(comboDiv.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleCombo();

      document.getElementById("add-option").addEventListener("click", () => {
        const optionName = document.getElementById("option-description").value;
        const optionContainer = document.getElementById("option-content");
        const optionContent = document.createElement("div");
        const deleteDivId = `delete-span-${comboboxOptionCount}`;

        optionContent.id = `comboOption${deleteDivId}`;
        optionContent.className = "combobox-options-content";
        const contentSpan = document.createElement("span");
        contentSpan.textContent = optionName;

        const deleteSpan = document.createElement("span");
        deleteSpan.className = "option-delete";
        deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

        if (optionName != "") comboboxOptionArray.push(optionName);

        deleteSpan.addEventListener("click", function () {
          // Remove the corresponding div when the delete span is clicked
          comboboxOptionArray = comboboxOptionArray.filter(function (item) {
            return item !== optionName;
          });
          optionContent.remove();
        });
        optionContent.appendChild(contentSpan);
        optionContent.appendChild(deleteSpan);

        if (optionName != "") {
          optionContainer.appendChild(optionContent);
          comboboxOptionCount++;
        }

        document.getElementById("option-description").value = "";
      });

      document
        .getElementById("combo-save-button")
        .addEventListener("click", handleCombo);

      resizeCanvas(comboDiv.id, COMBOBOX, comboId, COMBOBOX_OPTION);
      break;
    case LIST:
      document.getElementById("option-content-list").innerHTML = "";
      removeList();

      let list_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = list_x_y[0];
      pos_y_pdf = list_x_y[1];

      let listId = baseId;
      current_form_id = listId;

      formWidth = 300;
      formHeight = 120;

      let listDiv = document.createElement("div");
      listDiv.id = "list" + listId;
      addFormElementStyle(listDiv, topPos, leftPos, formWidth, formHeight);

      let dropList = document.createElement("div");
      dropList.style.display = "none";
      dropList.classList.add("list-field-input", "form-container");

      listDiv.append(dropList);

      pg.appendChild(listDiv);

      showOptionAndResizebar(
        LIST_OPTION,
        listDiv,
        formWidth,
        formHeight,
        "list"
      );
      const listAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      listAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "list-input-name"
      ).value = `Listbox Form Field ${listCount++}`;

      current_list_id = listId;

      listDiv.addEventListener("dblclick", (e) => {
        if (!isEditing) {
          current_list_id = listId;

          let islisttooltipshow = false;

          if (document.getElementById("list_tooltipbar" + current_list_id)) {
            islisttooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!islisttooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = listId;
              document.getElementById("option-content-list").innerHTML = "";
              form_storage.map((element) => {
                if (element.id == listId) {
                  document.getElementById("list-input-name").value =
                    element.form_field_name;
                  isOptionPane = true;
                  option = showOption(
                    LIST_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
                  document.getElementById("list-font-style").value =
                    element.fontStyle;
                  document.getElementById("list-font-size").value =
                    element.fontSize;
                  document.getElementById("list-font-color").value =
                    element.textColor;
                  document.getElementById("list-font-background-color").value =
                    element.textBackgroundColor;
                  document.getElementById("list-border-color").value =
                    element.borderColor;
                  document.getElementById("list-border-width").value =
                    element.borderWidth;

                  element.optionArray.map((elementItem) => {
                    const optionContent = document.createElement("div");
                    const deleteDivId = `delete-span-${listboxOptionCount}`;
                    optionContent.id = `listOption${deleteDivId}`;
                    optionContent.className = "combobox-options-content";
                    const contentSpan = document.createElement("span");
                    contentSpan.textContent = elementItem;
                    const deleteSpan = document.createElement("span");
                    deleteSpan.className = "option-delete";
                    deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';
                    deleteSpan.addEventListener("click", function () {
                      // Remove the corresponding div when the delete span is clicked
                      element.optionArray = element.optionArray.filter(function (item) {
                        return item !== elementItem;
                      });
                      optionContent.remove();
                    });
                    optionContent.append(contentSpan, deleteSpan);
                    document
                      .getElementById("option-content-list")
                      .append(optionContent);
                  });

                  $(document).on("click", "#" + LIST_OPTION, function(){
                    document.getElementById(listDiv.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + LIST_OPTION, function(){
                    document.getElementById(listDiv.id).style.zIndex = selectedZIndex;
                  });

                  listDiv.append(option);
                }
              });
              document
                .getElementById("list-save-button")
                .addEventListener("click", handleList);

              addDeleteButton(current_list_id, tooltipbar, listDiv, "list");
            } else {
              // document
              //   .getElementById("list_tooltipbar" + current_list_id)
              //   .remove();
            }
          }
          document.getElementById(listDiv.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleList();

      document
        .getElementById("add-option-list")
        .addEventListener("click", () => {
          const optionName = document.getElementById(
            "option-description-list"
          ).value;
          const optionContainer = document.getElementById(
            "option-content-list"
          );
          const optionContent = document.createElement("div");
          const deleteDivId = `delete-span-${listboxOptionCount}`;

          optionContent.id = `listOption${deleteDivId}`;
          optionContent.className = "combobox-options-content";
          const contentSpan = document.createElement("span");
          contentSpan.textContent = optionName;

          const deleteSpan = document.createElement("span");
          deleteSpan.className = "option-delete";
          deleteSpan.innerHTML = '<i class="fa fa-xmark"></i>';

          if (optionName != "") listboxOptionArray.push(optionName);

          deleteSpan.addEventListener("click", function () {
            // Remove the corresponding div when the delete span is clicked
            listboxOptionArray = listboxOptionArray.filter(function (item) {
              return item !== optionName;
            });
            optionContent.remove();
          });
          optionContent.appendChild(contentSpan);
          optionContent.appendChild(deleteSpan);

          if (optionName != "") {
            optionContainer.appendChild(optionContent);
            listboxOptionCount++;
          }

          document.getElementById("option-description-list").value = "";
        });

      document
        .getElementById("list-save-button")
        .addEventListener("click", handleList);

      resizeCanvas(listDiv.id, LIST, listId, LIST_OPTION);
      break;
    case BUTTON:
      removeButton();
      document.getElementById("button-field-input-action").value = "submit";

      let button_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = button_x_y[0];
      pos_y_pdf = button_x_y[1];

      let buttonId = baseId;
      current_form_id = buttonId;

      formWidth = 160;
      formHeight = 40;

      let buttonDiv = document.createElement("div");
      buttonDiv.id = "button" + buttonId;
      addFormElementStyle(
        buttonDiv,
        topPos,
        leftPos,
        formWidth,
        formHeight
      );

      let buttonAction = document.createElement("div");
      buttonAction.classList.add("button-field-input", "form-container");
      buttonAction.style.display = "none";
      buttonAction.addEventListener("click", function (event) {
        let parentElement = event.target.parentNode;
        let newId = parentElement.id.replace("button", "");
        if (form_storage  && form_storage !== null) {
          form_storage.forEach((item) => {
            if (item.id == newId) {
              if (item.action === SUBMIT) {
                if (window.confirm('Do you want to submit now?')) {
                  submitAction();
                }
              }
              else if (item.action === RESET) {

              }
            }
          })
        }
      })
      buttonDiv.append(buttonAction);

      pg.appendChild(buttonDiv);

      showOptionAndResizebar(
        BUTTON_OPTION,
        buttonDiv,
        formWidth,
        formHeight,
        "button"
      );
      const buttonAlign = document.querySelectorAll(
        'input[type=radio][name="text-field"]'
      );
      buttonAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "button-field-input-name"
      ).value = `Button Form Field ${buttonCount++}`;
      document.getElementById("button-text").value = "Button";
      current_button_id = buttonId;
      buttonDiv.addEventListener("dblclick", () => {
        if (!isEditing) {
          current_button_id = buttonId;

          let isbuttontooltipshow = false;

          if (
            document.getElementById("button_tooltipbar" + current_button_id)
          ) {
            isbuttontooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!isbuttontooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = buttonId;
              form_storage.map((element) => {
                if (element.id == buttonId) {
                  document.getElementById("button-field-input-name").value =
                    element.form_field_name;
                  isOptionPane = true;
                  option = showOption(
                    BUTTON_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
                  document.getElementById("button-font-style").value =
                    element.fontStyle;
                  document.getElementById("button-font-size").value =
                    element.fontSize;
                  document.getElementById("button-font-color").value =
                    element.textColor;
                  document.getElementById("button-font-background-color").value =
                    element.textBackgroundColor;
                  document.getElementById("button-border-color").value =
                    element.borderColor;
                  document.getElementById("button-border-width").value =
                    element.borderWidth;

                  const selectedValue = document.getElementById("button-field-input-action") && document.getElementById("button-field-input-action").value;
                  if (element.action == SUBMIT) {
                    selectedValue.value = "submit";
                  } else if (element.action == RESET) {
                    selectedValue.value = "reset";
                  }

                  $(document).on("click", "#" + BUTTON_OPTION, function(){
                    document.getElementById(buttonDiv.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + BUTTON_OPTION, function(){
                    document.getElementById(buttonDiv.id).style.zIndex = selectedZIndex;
                  });

                  buttonDiv.append(option);
                }
              });
              document
                .getElementById("button-save-button")
                .addEventListener("click", handleButton);
              addDeleteButton(
                current_button_id,
                tooltipbar,
                buttonDiv,
                "button"
              );
            } else {
              document
                .getElementById("button_tooltipbar" + current_button_id)
                .remove();
            }
          }
          document.getElementById(buttonDiv.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleButton();

      document
        .getElementById("button-save-button")
        .addEventListener("click", handleButton);
      resizeCanvas(buttonDiv.id, BUTTON, buttonId, BUTTON_OPTION);
      break;
    case DATE:
      removeDate();

      let date_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = date_x_y[0];
      pos_y_pdf = date_x_y[1];

      let dateId = baseId;
      current_form_id = dateId;

      formWidth = 160;
      formHeight = 40;

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const newDate = document.createElement("input");
      newDate.id = "datecontent" + dateId;
      newDate.classList.add("date-field-input", "form-container");
      newDate.style.position = "relative";
      newDate.type = "date";
      newDate.style.width = "100%";
      newDate.style.height = "100%";
      newDate.value = formattedDate;
      newDate.style.display = "none";

      newDate.addEventListener("change", () => {
        let dateId = baseId;
        current_form_id = dateId;
        handleDate();
      });

      let dateDiv = document.createElement("div");
      dateDiv.id = "date" + dateId;
      addFormElementStyle(dateDiv, topPos, leftPos, formWidth, formHeight);      

      dateDiv.append(newDate);
      pg.appendChild(dateDiv);

      // Show TextField OptionPane
      showOptionAndResizebar(
        DATE_OPTION,
        dateDiv,
        formWidth,
        formHeight,
        "date"
      );

      document.getElementById(
        "date-input-name"
      ).value = `Date Form Field ${datefieldCount++}`;

      current_date_id = dateId;
      current_date_content_id = newDate.id;

      dateDiv.addEventListener("dblclick", () => {
        if (!isEditing) {
          current_date_id = dateId;
          current_date_content_id = newDate.id;

          let isdatetooltipshow = false;

          if (document.getElementById("date_tooltipbar" + current_date_id)) {
            isdatetooltipshow = true;            
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!isdatetooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = dateId;

              form_storage.map((element) => {
                if (element.id == dateId) {
                  document.getElementById("date-input-name").value =
                    element.form_field_name;
                  isOptionPane = true;
                  option = showOption(
                    DATE_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
                  document.getElementById("date-font-style").value =
                    element.fontStyle;
                  document.getElementById("date-font-size").value =
                    element.baseFontSize;
                  document.getElementById("date-font-color").value =
                    element.textColor;
                  document.getElementById("date-font-background-color").value =
                    element.textBackgroundColor;
                  document.getElementById("date-border-color").value =
                    element.borderColor;
                  document.getElementById("date-border-width").value =
                    element.borderWidth;

                  let selected = element.align;
                  if (selected == ALIGN_LEFT)
                    document.getElementById("date-left").checked = true;
                  if (selected == ALIGN_CENTER)
                    document.getElementById("date-center").checked = true;
                  if (selected == ALIGN_RIGHT)
                    document.getElementById("date-right").checked = true;

                  $(document).on("click", "#" + DATE_OPTION, function(){
                    document.getElementById(dateDiv.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + DATE_OPTION, function(){
                    document.getElementById(dateDiv.id).style.zIndex = selectedZIndex;
                  });

                  dateDiv.append(option);
                }
              });

              document
                .getElementById("date-save-button")
                .addEventListener("click", handleDate);

              addDeleteButton(current_date_id, tooltipbar, dateDiv, "date");
            } else {
              document
                .getElementById("date_tooltipbar" + current_date_id)
                .remove();
            }
          }
          document.getElementById(dateDiv.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      handleDate();

      document
        .getElementById("date-save-button")
        .addEventListener("click", handleDate);
      resizeCanvas(dateDiv.id, DATE, dateId, DATE_OPTION);
      break;
    case SIGNATURE:
      removeSignature();
      let signature_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = signature_x_y[0];
      pos_y_pdf = signature_x_y[1];

      let signatureId = baseId;
      current_form_id = signatureId;

      formWidth = 200;
      formHeight = 40;

      const signatureContainer = document.createElement("div");
      signatureContainer.id = "signature" + signatureId;
      signatureContainer.className = "signatureContainer", "form-container";

      addFormElementStyle(
        signatureContainer,
        topPos,
        leftPos,
        formWidth,
        formHeight
      );
      signatureContainer.style.display = "flex";
      signatureContainer.style.alignItems = "center";
      signatureContainer.style.justifyContent = "center";
      signatureContainer.style.color = "black";
      signatureContainer.style.minHeight = "40px";
      signatureContainer.textContent = "Double click to sign here!";

      pg.appendChild(signatureContainer);      

      current_signature_id = signatureId;      
      
      signatureContainer.addEventListener("click", () => {
        if (!isEditing) {
          current_signature_id = signatureId;

          let istooltipshow = false;

          if (
            document.getElementById("signature_tooltipbar" + current_signature_id)
          ) {
            istooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!istooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = signatureId;
              addDeleteButton(
                current_signature_id,
                tooltipbar,
                signatureContainer,
                "signature"
              );
            } else {
              document
                .getElementById("signature_tooltipbar" + current_signature_id)
                .remove();
            }
          }
        }
      });

      signatureContainer.addEventListener("dblclick", () => {
        if (!isSubmit && !isEditing) {
          const signature_creator = document.getElementById(SIGNATURE_OPTION);
          signature_creator.style.display = "flex";
          document.getElementById("signature-initial-tab").click();
          resetCanvas();
          document.getElementById("signature-close").onclick = function () {
            signature_creator.style.display = "none";
          };
          document.getElementById("signature-close-button").onclick = function () {
            signature_creator.style.display = "none";
          };

          let canvasDraw = document.querySelector("#signature-draw-body canvas");
          let hasDrawn = false;

          canvasDraw.addEventListener('click', function () {
            hasDrawn = true;
          });

          document.getElementById("signature-create").onclick = function () {
            let canvas;

            signature_creator.style.display = "none";

            if (currentSignType == DRAW) {
              if (hasDrawn) {
                canvas = document.querySelector("#signature-draw-body canvas");
                signatureImgData = cropCanvas(canvas);
                createAndAppendImage(signatureImgData, signatureContainer, signatureId);
              }
              // handleSignature();
            } else if (currentSignType == TYPE) {
              let canvasType = document.getElementById("signature-type-text").value;
              if (canvasType != "") {
                canvas = document.getElementById("signature-type-canvas");
                signatureImgData = cropCanvas(canvas);
                createAndAppendImage(signatureImgData, signatureContainer, signatureId);
              }
            } else if (currentSignType == UPLOAD) {
              const file = document.getElementById("signature-image-input")
                .files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  signatureImgData = e.target.result;
                  createAndAppendImage(signatureImgData, signatureContainer, signatureId);
                  handleSignature();
                };
                reader.readAsDataURL(file);
              } else {
                alert("Please select an image file.");
              }
            } else if (currentSignType == PROFILE) {
              if (selectedProfileSignature) {
                signatureImgData = selectedProfileSignature;
                createAndAppendImage(selectedProfileSignature, signatureContainer, signatureId);
              } else {
                alert("Please select an image file.");
              }
            }

            handleSignature();
          };
        }
      });

      handleSignature();
      resizeCanvas(signatureContainer.id, SIGNATURE, signatureId);
      
      break;
    case SHAPE:
      let shapeId = baseId;
      
      shapeContainer.addEventListener("dblclick", () => {        
        if (!isEditing) {
          current_shape_id = shapeId;
          let istooltipshow = false;
          if (
            document.getElementById("shape_tooltipbar" + current_shape_id)
          ) {
            istooltipshow = true;
          }
          
          if (isDragging) {
            isDragging = false;
          } else {
            if (!istooltipshow) {
              let tooltipbar = document.createElement("div");
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
        }
      });
      break;
    case PHOTO:
      removePhoto();
      let image_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = image_x_y[0];
      pos_y_pdf = image_x_y[1];

      let photoId = baseId;
      current_form_id = photoId;

      formWidth = 250;
      formHeight = 100;

      const photoContainer = document.createElement("div");
      photoContainer.id = "photo" + photoId;
      photoContainer.className = "photoContainer";

      //...
      addPhotoElementStyle(
        photoContainer,
        topPos,
        leftPos,
        formWidth,
        formHeight
      );
      photoContainer.style.display = "flex";
      photoContainer.style.alignItems = "center";
      photoContainer.style.justifyContent = "center";
      photoContainer.style.color = "black";
      photoContainer.style.minHeight = "40px";
      photoContainer.textContent = "Double click to upload image!";

      pg.appendChild(photoContainer);
      handlePhoto();

      current_photo_id = photoId;

      resizeCanvas(photoContainer.id, PHOTO, photoId);
      photoContainer.addEventListener("click", () => {
        if (!isEditing) {
          current_photo_id = photoId;

          let istooltipshow = false;

          if (
            document.getElementById("photo_tooltipbar" + current_photo_id)
          ) {
            istooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!istooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = photoId;
              addDeleteButton(
                current_photo_id,
                tooltipbar,
                photoContainer,
                "photo"
              );
            } else {
              document
                .getElementById("photo_tooltipbar" + current_photo_id)
                .remove();
            }
          }
        }
      });

      photoContainer.addEventListener("dblclick", () => {
        if (!isSubmit && !isEditing) {
          const image_creator = document.getElementById(PHOTO_OPTION);
          image_creator.style.display = "flex";
          document.getElementById("photo-close").onclick = function () {
            image_creator.style.display = "none";
          };
          document.getElementById("photo-close-button").onclick = function () {
            image_creator.style.display = "none";
          };

          document.getElementById("photo-create").onclick = function () {
            const file = document.getElementById("photo-input").files[0];
            image_creator.style.display = "none";
            if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                photoData = e.target.result;
                handlePhoto();
                createAndAppendPhotoImage(photoData, photoContainer, photoId);
              };
              reader.readAsDataURL(file);
            }else{
              handlePhoto();
            }
          };
        }
      });
      break;
    case NUMBERFIELD:
      removeNumber();

      let number_x_y = PDFViewerApplication.pdfViewer._pages[
        PDFViewerApplication.page - 1
      ].viewport.convertToPdfPoint(x, y);

      pos_x_pdf = number_x_y[0];
      pos_y_pdf = number_x_y[1];

      let numberId = baseId;
      current_form_id = numberId;

      let numberFormWidth = 30;
      let numberFormHeight = 40;

      let numberDiv = document.createElement("div");
      numberDiv.id = "number" + numberId;
      addFormElementStyle(numberDiv, topPos, leftPos, numberFormWidth, numberFormHeight, "0");
    
      manageNumField(1, numberDiv);

      pg.appendChild(numberDiv);

      // Show TextField OptionPane
      showOptionAndResizebar(
        NUMBERFIELD_OPTION,
        numberDiv,
        numberFormWidth,
        numberFormHeight,
        "number"
      );
      
      const numberfieldAlign = document.querySelectorAll(
        'input[type=radio][name="number-field"]'
      );
      numberfieldAlign.forEach(function (radio) {
        radio.addEventListener("change", handleRadioSelection);
      });
      document.getElementById(
        "number-field-input-name"
      ).value = `Number Form Field ${numberfieldCount++}`;

      current_number_id = numberId;

      numberDiv.addEventListener("dblclick", () => {
        if (!isEditing) {
          current_number_id = numberId;

          let isnumbertooltipshow = false;

          if (document.getElementById("number_tooltipbar" + current_number_id)) {
            isnumbertooltipshow = true;
          }

          if (isDragging) {
            isDragging = false;
          } else {
            if (!isnumbertooltipshow) {
              let tooltipbar = document.createElement("div");
              current_form_id = numberId;

              form_storage.map((element) => {
                if (element.id == numberId) {
                  document.getElementById("number-field-input-name").value =
                    element.form_field_name;
                  isOptionPane = true;
                  option = showOption(
                    NUMBERFIELD_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
                  document.getElementById("number-font-style").value =
                    element.fontStyle;
                  document.getElementById("number-font-size").value =
                    element.fontSize;
                  document.getElementById("number-font-color").value =
                    element.textColor;
                  document.getElementById("number-font-background-color").value =
                    element.textBackgroundColor;
                  document.getElementById("number-border-color").value =
                    element.borderColor;
                  document.getElementById("number-border-width").value =
                    element.borderWidth;

                  document.getElementById("count").value = element.count;

                  let selected = element.align;
                  if (selected == ALIGN_LEFT)
                    document.getElementById("number-left").checked = true;
                  if (selected == ALIGN_CENTER)
                    document.getElementById("number-center").checked = true;
                  if (selected == ALIGN_RIGHT)
                    document.getElementById("number-right").checked = true;

                  $(document).on("click", "#" + NUMBERFIELD_OPTION, function(){
                    document.getElementById(numberDiv.id).style.zIndex = selectedZIndex;
                  });
                  $(document).on("mousedown", "#" + NUMBERFIELD_OPTION, function(){
                    document.getElementById(numberDiv.id).style.zIndex = selectedZIndex;
                  });

                  numberDiv.append(option);
                }
              });

              addDeleteButton(current_number_id, tooltipbar, numberDiv, "number");
            } else {
              document
                .getElementById("number_tooltipbar" + current_number_id)
                .remove();
            }
          }
          document.getElementById(numberDiv.id).style.zIndex = selectedZIndex;
          displayFormProps();
        }
      });

      document.getElementById("number-save-button").addEventListener("click", function() {
        handleNumber();
        const count = parseInt(document.getElementById("count").value);
        const activeNumberDiv = document.getElementById(`number${current_number_id}`);
        if (!isNaN(count)) {
          manageNumField(count, activeNumberDiv);
        }
      });

      document.getElementById("count").addEventListener("input", function () {
        const countValue = parseInt(this.value);
        const activeNumberDiv = document.getElementById(`number${current_number_id}`);
        
        if (activeNumberDiv) {
          manageNumField(countValue, activeNumberDiv);
        }
      });

      resizeCanvas(numberDiv.id, NUMBERFIELD, numberId, NUMBERFIELD_OPTION);
    
      function manageNumField(count, numberDiv){
        numberDiv.style.width = numberFormWidth * count + "px";
        numberDiv.querySelectorAll(".number-field-input").forEach(el => el.remove());

        for (let i = 1; i <= count; i++) {
          let numberElement = document.createElement("input");
          numberElement.classList.add("number-field-input", "form-container");
          numberElement.type = "number";
          numberElement.min = "0";
          numberElement.max = "9";
          numberElement.style.display = "none";
          numberElement.addEventListener("input", function (e) {
            const value = parseInt(numberElement.value, 10);
            
            if (!isNaN(value) && value >= 0 && value <= 9) {
              const nextInput = numberElement.nextElementSibling;
              if (nextInput && nextInput.classList.contains("number-field-input")) {
                nextInput.focus();
              }
            } else {
              numberElement.value = "";
            }
          });
    
          numberDiv.appendChild(numberElement);
        }
      }
      break;
    default:
      break;
  }
};

function createAndAppendImage(imgData, container, id) {
  const signatureImg = document.createElement("img");
  signatureImg.className = "signatureImg";
  signatureImg.id = "signatureImg" + id;
  signatureImg.style.width = "100%";
  signatureImg.style.height = "100%";
  signatureImg.src = imgData;
  signatureImg.style.objectFit = "cover";
  container.textContent = "";
  container.append(signatureImg);
  // resizeCanvas(container.id, SIGNATURE, id);
}

function createAndAppendPhotoImage(photoData, container, id) {
  const img = document.createElement("img");
  img.className = "photo";
  img.style.width = "100%";
  img.style.height = "100%";
  img.src = photoData;
  img.style.objectFit = "cover";
  container.textContent = "";
  container.append(img);
  resizeCanvas(container.id, PHOTO, id);
}

function getBoundingBox(canvas) {
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  let minX = canvas.width,
    minY = canvas.height,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;
      if (pixels[i + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function cropCanvas(canvas) {
  // Get the bounding box of the drawn content
  boundingBox = getBoundingBox(canvas);

  // Create a new canvas with the dimensions of the bounding box
  let newCanvas = document.createElement("canvas");
  newCanvas.width = boundingBox.width;
  newCanvas.height = boundingBox.height;
  let newCtx = newCanvas.getContext("2d");

  // Copy the drawn content to the new canvas
  newCtx.drawImage(
    canvas,
    boundingBox.x,
    boundingBox.y,
    boundingBox.width,
    boundingBox.height,
    0,
    0,
    boundingBox.width,
    boundingBox.height
  );

  // Convert the content of the new canvas to a data URL
  return newCanvas.toDataURL();
}

const flatten = async function () {  
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  
  if (form_storage && form_storage.length != 0)
    addFormElements().then(() => {
      add_txt_comment();
      form.flatten();
    });
  else {
    add_txt_comment();
    form.flatten();
  }
};

function hexToRgb1(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255]; // Convert to [0, 1] range
}

async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function embedImage(form_item, pdfDoc, page) {
  let imgData = form_item.form_type === SIGNATURE ? form_item.imgData : form_item.photoData;

  if (!imgData.includes("data:image/png;base64")) {
    imgData = $("#" + form_item.containerId).find("img").attr("src");
  }

  try {
    let image;
    if (imgData.includes("data:image/png")) {
      image = await pdfDoc.embedPng(imgData);
    } else if (imgData.includes("data:image/jpeg")) {
      image = await pdfDoc.embedJpg(imgData);
    } else {
      throw new Error('Unsupported image format');
    }

    page.drawRectangle({
      x: form_item.x,
      y: form_item.y - form_item.yPage * 0.75,
      width: form_item.xPage * 0.75,
      height: form_item.yPage * 0.75,
      color: form_item.textBackgroundColor ? hexToRgbNew(form_item.textBackgroundColor) : PDFLib.rgb(1, 1, 1),
      borderColor: hexToRgbNew(form_item.borderColor),
      borderWidth: parseInt(form_item.borderWidth),
    });
    
    page.drawImage(image, {
      x: form_item.x,
      y: form_item.y - form_item.yPage * 0.75,
      width: form_item.xPage * 0.75,
      height: form_item.yPage * 0.75,
    });
    
  } catch (error) {
    console.error('Error embedding image:', error);
  }
}

async function addFormElements() {
  const fontStyles = {
    Courier: PDFLib.StandardFonts.Courier,
    CourierBold: PDFLib.StandardFonts.CourierBold,
    CourierBoldOblique: PDFLib.StandardFonts.CourierBoldOblique,
    CourierOblique: PDFLib.StandardFonts.CourierOblique,
    Helvetica: PDFLib.StandardFonts.Helvetica,
    HelveticaBold: PDFLib.StandardFonts.HelveticaBold,
    HelveticaBoldOblique: PDFLib.StandardFonts.HelveticaBoldOblique,
    HelveticaOblique: PDFLib.StandardFonts.HelveticaOblique,
    TimesRoman: PDFLib.StandardFonts.TimesRoman,
    TimesRomanBold: PDFLib.StandardFonts.TimesRomanBold,
    TimesRomanBoldItalic: PDFLib.StandardFonts.TimesRomanBoldItalic,
    TimesRomanItalic: PDFLib.StandardFonts.TimesRomanItalic,
  };
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const firstPage = pdfDoc.getPage(0);
  const { width, height } = firstPage.getSize();
  const form = pdfDoc.getForm();
  let page;
  let checkboxForm, radioForm, textfieldForm, comboboxForm, datefieldForm;
  let radioOption;
  let selectedFont = "";
  let customFont = "";
  if (draw_form_storage && draw_form_storage.length != 0) {
    draw_form_storage.map(async (form_item) => {
      page = pdfDoc.getPage(form_item.page_number - 1);
      if (form_item.form_type == RADIO) {
        if (radioOption != form_item.data.option) {
          radioOption = form_item.data.option;
          radioForm = form.createRadioGroup(radioOption);
        }
      }
      if (
        form_item.form_type != CHECKBOX &&
        form_item.form_type != RADIO &&
        form_item.form_type != SIGNATURE &&
        form_item.form_type != SHAPE,
        form_item.form_type != PHOTO
      ) {
        const fontName = form_item.fontStyle;
        if (fontName && fontStyles.hasOwnProperty(fontName)) {
          selectedFont = fontStyles[fontName];
        } else {
          const fontByte = font_storage.find(
            (font) => font.fontName === fontName
          );
          if (fontByte) {
            selectedFont = fontByte.fontArrayBuffer;
          }
        }
        if (selectedFont) {
          customFont = await pdfDoc.embedFont(selectedFont);
        }
      }
      switch (form_item.form_type) {
        case CHECKBOX:
          const color1 = form_item.textBackgroundColor === undefined ? '#ccc' : form_item.textBackgroundColor;
          page.drawRectangle({
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
            color: hexToRgbNew(color1),
            borderColor: hexToRgbNew(color1),
          });
          checkboxForm = form.createCheckBox(form_item.form_field_name);
          checkboxForm.addToPage(page, {
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
            backgroundColor: hexToRgbNew(color1),
            borderColor: hexToRgbNew(color1),
          });
          if (form_item.isChecked) {
            checkboxForm.check();
          }
          if (form_item.isReadOnly) {
            checkboxForm.enableReadOnly();
          }
          break;
        case RADIO:
          const color2 = form_item.textBackgroundColor === undefined ? '#ccc' : form_item.textBackgroundColor;
          if (typeof radioCount === 'undefined' || radioCount === null) {
            radioCount = 0;
          }

          const fieldName = `${radioCount}`;

          if (form_item.data.isReadOnly) {
            radioForm.addOptionToPage(fieldName, page, {
              x: form_item.data.x,
              y: form_item.data.y - form_item.data.height,
              width: form_item.data.width,
              height: form_item.data.height,
              backgroundColor: hexToRgbNew(color2),
              borderColor: hexToRgbNew(color2),
            });
            if (form_item.data.isChecked) {
              radioForm.select(fieldName);
            }
            radioForm.enableReadOnly();
          } else {
            radioForm.addOptionToPage(fieldName, page, {
              x: form_item.data.x,
              y: form_item.data.y - form_item.data.height,
              width: form_item.data.width,
              height: form_item.data.height,
              backgroundColor: hexToRgbNew(color2),
              borderColor: hexToRgbNew(color2),
            });
        
            if (form_item.data.isChecked) {
              radioForm.select(fieldName);
            }
          }
          
          radioCount++;
          break;
        case DATE:
          if (!form_item.isReadOnly) {          
            datefieldForm = form.createTextField(form_item.form_field_name);
            datefieldForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            datefieldForm.setFontSize(form_item.fontSize);
            datefieldForm.setText(form_item.text);
            datefieldForm.updateAppearances(customFont);
            datefieldForm.defaultUpdateAppearances(customFont);
            datefieldForm.enableReadOnly();
          } else {
            const initialValue = form_item.text !== undefined ? form_item.text : "";
            page.drawRectangle({
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              color: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            const textY = form_item.y - form_item.yPage * 0.75 / 2 - form_item.fontSize / 3;
            page.drawText(initialValue, {
              x: form_item.x + 2,
              y: textY,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
              font: customFont
            });
          }
          break;
        case TEXTFIELD:
          const initialValue = form_item.initialValue !== undefined ? form_item.initialValue : "";
          if (!form_item.isReadOnly) {
            textfieldForm = form.createTextField(form_item.form_field_name);
            textfieldForm.setText(initialValue);
            textfieldForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              size: form_item.fontSize,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            textfieldForm.setFontSize(form_item.fontSize);
            textfieldForm.updateAppearances(customFont);
            // textfieldForm.defaultUpdateAppearances(customFont);
          } else {
            page.drawRectangle({
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              color: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });

            const textY = form_item.y - form_item.yPage * 0.75 / 2 - form_item.fontSize / 3;

            page.drawText(initialValue, {
              x: form_item.x,
              y: textY,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
              font: customFont
            });
          }
          break;
        case COMBOBOX:
          if (!form_item.isReadOnly) {
            comboboxForm = form.createDropdown(form_item.form_field_name);
            comboboxForm.addOptions(form_item.optionArray);
            if (form_item.initialValue)
              comboboxForm.select(form_item.initialValue);
            comboboxForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            comboboxForm.setFontSize(form_item.fontSize);
          } else {
            const initialValue = form_item.initialValue !== undefined ? form_item.initialValue : form_item.optionArray[0];
    
            page.drawRectangle({
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              color: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            
            const textY = form_item.y - form_item.yPage * 0.75 / 2 - form_item.fontSize / 3;

            page.drawText(initialValue, {
              x: form_item.x + 2,
              y: textY,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
              font: customFont
            });
          }
          break;
        case LIST:
          if (!form_item.isReadOnly) {
            listboxForm = form.createOptionList(form_item.form_field_name);
            listboxForm.addOptions(form_item.optionArray);
            if (form_item.initialValue)
              listboxForm.select(form_item.initialValue);

            listboxForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              size: form_item.fontSize,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            listboxForm.setFontSize(form_item.fontSize);
            listboxForm.updateAppearances(customFont);
            // listboxForm.defaultUpdateAppearances(customFont);
          } else {
            const initialValue = form_item.initialValue !== undefined ? form_item.initialValue : "";
            page.drawRectangle({
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              color: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });
            page.drawText(initialValue, {
              x: form_item.x + 2,
              y: form_item.y - form_item.fontSize - 2,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
              font: customFont
            });
          }
          break;
        case BUTTON:
          buttonfieldForm = form.createButton(form_item.form_field_name);
          buttonfieldForm.addToPage(form_item.text, page, {
            x: form_item.x,
            y: form_item.y - form_item.yPage * 0.75,
            width: form_item.xPage * 0.75,
            height: form_item.yPage * 0.75,
            textColor: hexToRgbNew(form_item.textColor),
            backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
            borderColor: hexToRgbNew(form_item.borderColor),
            borderWidth: parseInt(form_item.borderWidth),
          });
          buttonfieldForm.setFontSize(form_item.fontSize);
          buttonfieldForm.updateAppearances(customFont);
          // buttonfieldForm.defaultUpdateAppearances(customFont);
          let formScript = "";
          if (form_item.action == SUBMIT) {
            formScript = `
                            for (var i = 0; i < this.numFields; i++) {
                                var fieldName = this.getNthFieldName(i);
                                var field = this.getField(fieldName);
                                field.readonly = true;
                                field.lineWidth = 0;
                            }
                            this.saveAs("flattened.pdf");
                        `;
          } else if (form_item.action == RESET) {
            formScript = `
                            for (var i = 0; i < this.numFields; i++) {
                                var fieldName = this.getNthFieldName(i);
                                var fieldType = this.getField(fieldName).type;
                        
                                // Check if the field is not a button
                                if (fieldType !== "button") {
                                    // Reset the value of the field
                                    this.getField(fieldName).value = "";
                                }
                            }
                        `;
            // formScript = 'console.show(); console.println("Hello World!");';
          } else if (form_item.action == NOACTION) {
            formScript = `
                           console.show(); 
                        `;
            // console.show();
            // myFunc = function(doc) {
            //     app.beginPriv();
            //     doc.getField("Signature").signatureSign({bUI:true});
            //     app.endPriv();
            //    }
            // app.trustedFunction(myFunc);
            // myFunc(this);
            // var sign = this.getField("Signature");
            // var run = app.trustedFunction(function() {
            //     app.beginPriv();
            //     sign.signatureSign({bUI:true});
            //     app.endPriv();
            // });
            // run();
          }

          buttonfieldForm.acroField.getWidgets().forEach((widget) => {
            widget.dict.set(
              PDFLib.PDFName.of("AA"),
              pdfDoc.context.obj({
                U: {
                  Type: "Action",
                  S: "JavaScript",
                  JS: PDFLib.PDFHexString.fromText(formScript),
                },
              })
            );
          });
          break;
        case SIGNATURE:
          if (form_item.imgData != undefined) {
            await embedImage(form_item, pdfDoc, page);
          }else{
            page.drawRectangle({
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              color: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });

            const text = "Double click to sign here!";
            const fontSize = 10;
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            const textX = form_item.x + (form_item.xPage * 0.75 - textWidth) / 2;
            const textY = form_item.y - form_item.yPage * 0.75 + (form_item.yPage * 0.75 - fontSize) / 2;

            page.drawText(text, {
              x: textX,
              y: textY,
              size: fontSize,
              color: hexToRgbNew("#000000"),
            });
          }
          break;
        case SHAPE:
          const fillColor = hexToRgbNew(form_item.shapeFillColor || '#FFFFFF');
          const borderColor = hexToRgbNew(form_item.borderColor || '#000000');
          const bordersWidth = parseFloat(form_item.borderWidth) || 1;
          const borderRadius = parseFloat(form_item.borderRadius) || 0;
        
          page.drawRectangle({
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
            color: fillColor,
            borderColor: borderColor,
            borderWidth: bordersWidth,
            borderRadius: borderRadius
          });
        
          if (form_item.shapeText) {
            const textY = form_item.y - form_item.height / 2;
            const textSize = parseFloat(form_item.textSize) || 12;
        
            page.drawText(form_item.shapeText.replace(/<[^>]+>/g, ''), {
              x: form_item.x + 5,
              y: textY,
              size: textSize,
              color: hexToRgbNew(form_item.textColor || '#000000'),
              font: await pdfDoc.embedFont(PDFLib.StandardFonts.Courier),
              maxWidth: form_item.width - 10
            });
          }
          break;
        case PHOTO:
          if (form_item.photoData != undefined) {
            await embedImage(form_item, pdfDoc, page);
          }else{
            page.drawRectangle({
              x: form_item.x,
              y: form_item.y - form_item.yPage * 0.75,
              width: form_item.xPage * 0.75,
              height: form_item.yPage * 0.75,
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.borderColor),
              borderWidth: parseInt(form_item.borderWidth),
            });

            const text = "Double click to upload image!";
            const fontSize = 10;
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            const textWidth = font.widthOfTextAtSize(text, fontSize);
            const textX = form_item.x + (form_item.xPage * 0.75 - textWidth) / 2;
            const textY = form_item.y - form_item.yPage * 0.75 + (form_item.yPage * 0.75 - fontSize) / 2;

            page.drawText(text, {
              x: textX,
              y: textY,
              size: fontSize,
              color: hexToRgbNew("#000000"),
            });
          }
          break;
        case NUMBERFIELD:
          const numberValue = form_item.initialValue !== undefined ? form_item.initialValue : "";
          const numberArr = numberValue.split("");
          const squareWidth = form_item.xPage * 0.75;
          const squareHeight = form_item.yPage * 0.75;
          const borderWidth = 1;

          numberArr.forEach(function (item, index) {
            const digitX = form_item.x + (index * squareWidth);

            if (!form_item.isReadOnly) {
              textfieldForm = form.createTextField(form_item.form_field_name + "_" + index);
              textfieldForm.setText(item == "-" ? "" : item);
              textfieldForm.addToPage(page, {
                x: digitX,
                y: form_item.y - squareHeight,
                width: squareWidth - borderWidth * 1,
                height: squareHeight - borderWidth * 1,
                size: form_item.fontSize,
                textColor: hexToRgbNew(form_item.textColor),
                backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
                borderColor: hexToRgbNew(form_item.borderColor),
                borderWidth: parseInt(form_item.borderWidth),
              });
              textfieldForm.setFontSize(form_item.fontSize);
              textfieldForm.updateAppearances(customFont);
            } else {
              // Draw background rectangle
              page.drawRectangle({
                x: digitX,
                y: form_item.y - squareHeight,
                width: squareWidth,
                height: squareHeight,
                color: hexToRgbNew(form_item.textBackgroundColor),
                borderColor: hexToRgbNew(form_item.borderColor),
                borderWidth: parseInt(form_item.borderWidth),
              });
        
              // Calculate the width of the text
              const textWidth = customFont.widthOfTextAtSize(item, form_item.fontSize);
        
              let textX;
              // Handle horizontal alignment (0 = left, 1 = center, 2 = right)
              if (form_item.align == 1) {
                // Center alignment
                textX = digitX + (squareWidth - textWidth) / 2;
              } else if (form_item.align == 2) {
                // Right alignment
                textX = digitX + squareWidth - textWidth - 2; // 2px padding from the right
              } else {
                // Left alignment (default)
                textX = digitX + 2; // 2px padding from the left
              }
        
              // Calculate vertical alignment (centered vertically within the box)
              const textY = form_item.y - squareHeight + (squareHeight - form_item.fontSize) / 2;
        
              // Draw the text with adjusted alignment
              page.drawText(item, {
                x: textX,
                y: textY,
                size: form_item.fontSize,
                color: hexToRgbNew(form_item.textColor),
                font: customFont,
              });
            }
          });
          break;

        default:
          break;
      }
    });
  }
  if (text_storage && text_storage.length != 0) {
    await Promise.all(
      text_storage.map(async (text_item) => {
        const fontName = text_item.fontStyle;
        if (fontStyles.hasOwnProperty(fontName)) {
          selectedFont = fontStyles[fontName];
        } else {
          const fontByte = font_storage.find(
            (font) => font.fontName === fontName
          );
          selectedFont = fontByte.fontArrayBuffer;
        }
        const customFont = await pdfDoc.embedFont(selectedFont);
        page = pdfDoc.getPage(text_item.page_number - 1);
        // selectedFont = fontStyles[text_item.fontStyle] || PDFLib.StandardFonts.Helvetica;

        let { r, g, b } = hexToRgb(text_item.textColor);
        let content = ``;
        text_item.text.map((item) => {
          content += `${item}\n`;
        });
        page.drawText(content, {
          x: text_item.x,
          y: text_item.y - text_item.height,
          font: customFont,
          size: text_item.fontSize,
          color: hexToRgbNew(text_item.textColor),
          lineHeight: 10,
          // wordBreaks: true,
        });
      })
    );
  }
  pdfBytes = await pdfDoc.save();
}

$(".view-mode .item").click(function(){
  const type = $(this).attr("type");
  changeMode(type);
  $(".view-mode .item").removeClass("active");
  $(this).addClass("active");
})

const changeMode = (type) => {
  const formfields = document.querySelectorAll(".form-fields");
  const checkfields = document.querySelectorAll(".checkmark");
  const radiofields1 = document.querySelectorAll(".radioinputchild");
  const radiofields2 = document.querySelectorAll(".checkmark-radio");
  const textfields = document.querySelectorAll(".text-field-input");
  const combofields = document.querySelectorAll(".combobox-field-input");
  const combovalues = document.querySelectorAll(".combobox-field-value");
  const listfields = document.querySelectorAll(".list-field-input");
  const buttonfields = document.querySelectorAll(".button-field-input");
  const datefields = document.querySelectorAll(".date-field-input");
  const textcontentfields = document.querySelectorAll(".textcontent");
  const signatureFields = document.querySelectorAll(".signatureContainer");
  const shapeFields = document.querySelectorAll(".shapeContainer");
  const photoFields = document.querySelectorAll(".photoContainer");
  const numberfields = document.querySelectorAll(".number-field-input");
  isEditing = type === "edit";
  if (isEditing) {
    isEditing = false;
    sidebar.querySelectorAll("button").forEach((item) => {
      item.disabled = false;
    });

    formfields.forEach((item) => {
      // item.style.background = "#3C97FE";
      item.style.flexDirection = "column";
    });

    // Disable all checkbox and radiobutton field to input
    checkfields.forEach((item) => (item.style.display = "none"));
    radiofields1.forEach((item) => (item.style.display = "none"));
    radiofields2.forEach((item) => (item.style.display = "none"));

    // Disable all text field to input
    textfields.forEach((item) => (item.style.display = "none"));

    // Disable all combobox field
    combofields.forEach((item) => (item.style.display = "none"));

    // Disable all listbox fields
    listfields.forEach((item) => (item.style.display = "none"));

    // Disable all button fields
    buttonfields.forEach((item) => (item.style.display = "none"));

    datefields.forEach((item) => (item.style.display = "none"));

    textcontentfields.forEach((item) => { item.contentEditable = "true" });

    signatureFields.forEach((item) => { item.style.border = "none" });

    shapeFields.forEach((item) => { item.contentEditable = "true" });

    photoFields.forEach((item) => { item.style.border = "none" });

    numberfields.forEach((item) => (item.style.display = "none"));

  } else {
    isEditing = true;
    sidebar.querySelectorAll("button").forEach((item) => {
      item.disabled = true;
    });
    // Disable resize and move for all form fields
    formfields.forEach((item) => {
      if (item.querySelector("#topLeft")) removeResizebar(item.id);
      if (item.querySelector(".delete-button")) item.querySelector(".delete-button").remove();
      // item.style.background = "white";
      // item.style.border = `${item.borderWidth}px solid ${item.borderColor}`;
      item.style.border = "none";

      if(item.id.includes("number")){
        item.style.display = "flex";
        item.style.flexDirection = "row";
        // item.style.border = "none";
      }
    });
    // Enable all checkbox and radio field to input
    checkfields.forEach((item) => {
      item.style.display = "flex";

      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("checkbox", "");
          if (formItem.id == formId) {
            item.style.backgroundColor = formItem.textBackgroundColor;
            // item.style.border = "none";
            item.style.border = "1px solid #202020";
          }
        })
      }
    });
    radiofields1.forEach((item) => {
      item.style.display = "inline-block";
      item.style.backgroundColor = item.textBackgroundColor;
    });
    radiofields2.forEach((item) => {
      item.style.display = "inline-block";

      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("radio", "");
          if (formItem.id == formId) {
            item.style.backgroundColor = formItem.textBackgroundColor;
            // item.style.border = "none";
            item.style.border = "1px solid #202020";
          }
        })
      }
    });
    // Enable all text field to input
    textfields.forEach((item) => {
      item.style.display = "block";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("text", "");
          if (formItem.id == formId) {
            item.style.fontFamily = formItem.fontStyle;
            item.style.fontSize = formItem.fontSize + "px";
            item.style.color = formItem.textColor;
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;

            if (formItem.align == 0) item.style.textAlign = "left";
            else if (formItem.align == 1) item.style.textAlign = "center";
            else if (formItem.align == 2) item.style.textAlign = "right";
          }
        });
      }
    });
    // Enable all combobox fields
    combofields.forEach((item) => {
      item.style.display = "block";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("combo", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize / 0.75 + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;
            if (formItem.optionArray.length != 0) {
              item.innerHTML = "";
              formItem.optionArray.forEach((optionItem) => {
                let optionElement = document.createElement("option");
                optionElement.value = optionItem;
                optionElement.text = optionItem;
                item.append(optionElement);
              });
            }
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.borderColor = formItem.borderColor;
            item.style.borderWidth = formItem.borderWidth + "px";
          }
        });
      }
    });
    combovalues.forEach((item) => {
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("combo", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize / 0.75 + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
          }
        });
      }
    });
    // Enable all listbox fields
    listfields.forEach((item) => {
      let activeElement = null;
      item.style.display = "block";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("list", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize / 0.75 + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;
            if (formItem.optionArray.length != 0) {
              item.innerHTML = "";
              formItem.optionArray.forEach((optionItem) => {
                let optionElement = document.createElement("p");
                optionElement.onclick = function () {
                  if (activeElement) {
                    activeElement.classList.remove("active");
                  }
                  current_form_id = formId;
                  optionElement.classList.add("active");
                  activeElement = optionElement;
                  handleList();
                }
                optionElement.textContent = optionItem;
                item.append(optionElement);
              });
            }
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
          }
        });
      }
    })
    // Enable all button fields
    buttonfields.forEach((item) => {
      item.style.display = "flex";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("button", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize / 0.75 + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;
            item.textContent = formItem.text;
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
          }
        })
      }
    })
    // Enable all text content fields
    textcontentfields.forEach((item) => {
      item.contentEditable = "false";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("date", "");
          if (formItem.id == formId) {
            item.style.color = formItem.textColor;
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
          }
        })
      }
    });
    signatureFields.forEach((item) => {
      item.contentEditable = "false";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.id.replace("signature", "");
          if (formItem.id == formId) {
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = formItem.borderWidth + "px solid " + formItem.borderColor;
          }
        })
      }
    });
    photoFields.forEach((item) => {
      item.contentEditable = "false";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.id.replace("photo", "");
          if (formItem.id == formId) {
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = formItem.borderWidth + "px solid " + formItem.borderColor;
          }
        })
      }
    });
    // Enable all date fields
    datefields.forEach((item) => {
      item.style.display = "block";
      if (form_storage  && form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("date", "");
          if (formItem.id == formId) {
            item.style.fontFamily = formItem.fontStyle;
            item.style.fontSize = formItem.fontSize + "px";
            item.style.color = formItem.textColor;
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
          }
        });
      }
    });
    // Enable all text field to input
    numberfields.forEach((item) => {
      item.style.display = "block";
      $("#number-field-option").hide();
      if (form_storage  && form_storage !== null) {        
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("number", "");
          if (formItem.id == formId) {
            // if(formItem.isBold) item.style.fontWeight = "bold";
            // else item.style.fontWeight = "normal";
            // if(formItem.isItalic) item.style.fontStyle = "italic";
            // else item.style.fontStyle = "normal";
            item.style.fontSize = formItem.fontSize + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.fontStyle;
            if (formItem.align == 0) item.style.textAlign = "left";
            else if (formItem.align == 1) item.style.textAlign = "center";
            else if (formItem.align == 2) item.style.textAlign = "right";

            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = `${formItem.borderWidth}px solid ${formItem.borderColor}`;
          }
        });
      }
    });
  }
};

function toggleCheckbox(id) {
  if (isEditing && !isSubmit) {
    const checkbox = document.getElementById(id);
    checkbox.classList.toggle("checked");
  }
}

function updateFormStorage(old_form_storage, lst) {
  old_form_storage.forEach((item, index) => {
    if (lst.includes(index + 1)) {
      item.isChecked = true;
    } else {
      item.isChecked = false;
    }
  });

  form_storage = old_form_storage;
}

function selectRadioButton(element, id) {
  if (isEditing && !isSubmit) {
    // Find the radio input within the clicked div
    let radioInput = element.querySelector('input[type="radio"]');

    // If the radio input is not checked, set it to checked
    if (!radioInput.checked) {
      radioInput.checked = true;
      form_storage.map((item) => {
        if (item.hasOwnProperty("data")) {
          if (item.id === id) {
            item.data.isChecked = true;
            form_storage.map((item1) => {
              if (item1.hasOwnProperty("data")) {
                if (
                  item.data.option === item1.data.option &&
                  item.id != item1.id
                ) {
                  item1.data.isChecked = false;
                }
              }
            });
          }
        }
      });
    }
  }
}

const handleEditMode = function (formId) {
  if (!isSubmit) {
    form_storage.map((item) => {
      if (item.form_type == CHECKBOX) {
        if (item.id === formId) {
          if (!item.isChecked) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
        }
      }
    });
    current_form_id = formId;
  }
};

const sendSubmitData = function () {
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('pdfFile', pdfBlob, "uploaded.pdf");
  formData.append('pdfFormData', JSON.stringify(form_storage));
  formData.append('name', clientName);
  formData.append('email', clientEmail);
  formData.append('currentId', requestId);

  $("body").addClass("loading");

  fetch(`${BASE_URL}/savedocument`, {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        searchFormButton.style.display = "none";
        $("body").removeClass("loading");
        alert("Thanks for your submitting your document!");        
      } else {
        console.error('Failed to upload PDF file');
      }
    })
    .catch(error => console.error('Error:', error));
}

const submitDocument = async function () {
  if (window.confirm('Do you continue to submit now?')) {
    submitAction();
    pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    pdfBytes = await pdfDoc.save();
    if (form_storage && form_storage.length != 0) {
      addFormElements().then(() => {
        sendSubmitData();
      });
    } else {
      sendSubmitData();
    }
  }
}

//... Tracking
const handleTrack = function (id, value) {
  $(".historyDiv").each(function () {
    var index = $(this).index();
    if (id === index) {
      $(this).find(".actiontext").text(value);
    }
  })
}

const getImgHeight = async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  
  let width = img.width;
  let height = img.height;
  
  return { width: width, height: height};
}

function shapeTextAlign(shapeText, selectedTextAlign) {
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

function searchForm() {
  const formFields = document.querySelectorAll('.form-fields');

  if (formFields.length > 0) {
    function updateResizebar() {
      formFields.forEach(field => {
        field.classList.remove('active');
      });

      if (formFields[active_form_index]) {
        formFields[active_form_index].classList.add('active');
      }
    }

    document.getElementById('nextBtn').addEventListener('click', function () {
      if (active_form_index < draw_form_storage.length - 1) {
        active_form_index++;
        updateResizebar();
      }
    });

    document.getElementById('prevBtn').addEventListener('click', function () {
      if (active_form_index > 0) {
        active_form_index--;
        updateResizebar();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        // Same functionality as nextBtn click event
        if (active_form_index < draw_form_storage.length - 1) {
          active_form_index++;
          updateResizebar();
        }
      }
    });

  } else {
    console.error("No form fields found");
  }
}

for (i = 0; i < openHeader.length; i++) {
  openHeader[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

function displayFormProps() {
  const headers = document.getElementsByClassName("openHeader");
  const bodies = document.getElementsByClassName("openBody");

  for (let i = 0; i < headers.length; i++) {
    headers[i].classList.remove("active");
  }
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].style.maxHeight = null;
  }
}

function openTab(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "grid";
  evt.currentTarget.className += " active";

  $(".tabitem").removeClass("active_menu");
  addForm();
  isAddCommentModeOn = false;
  isTextModeOn = false;
  isDrawingShape = false;
}