// let baseId = 0;
let draw_form_storage;
let current_form_id = 0;
let currentMode = null;

let checkboxCount = 1,
  radioCount = 1,
  textfieldCount = 1,
  comboCount = 1,
  listCount = 1,
  buttonCount = 1,
  datefieldCount = 1;

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
  textColor = "";
textBackgroundColor = "";

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

let signatureImgData, shapeImgData;

let boundingBox;

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
      rightSidebarButton.style.display = "none";
      shareDocumentButton.style.display = "none";
      addTextButton.style.display = "none";
      addCommentButton.style.display = "none";
      showHistoryButton.style.display = "none";
      saveDraftButton.style.display = "none";
      submitDocumentButton.style.display = "flex";
      changeMode();
    } else {
      if (isDraft == "true") {
        addTextButton.style.display = "block";
        const viewer = document.getElementById('viewer');
        viewer.addEventListener('click', e => { });
        viewer.dispatchEvent(new Event('click'));
      } else {
        //... open submitted document
        rightSidebarButton.style.display = "none";
        shareDocumentButton.style.display = "none";
        addTextButton.style.display = "none";
        addCommentButton.style.display = "none";
        showHistoryButton.style.display = "none";
        saveDraftButton.style.display = "none";
        submitDocumentButton.style.display = "none";
        changeMode();
      }
    }
  }
}

const drawFormElement = function () {
  form_storage = draw_form_storage;
  console.log("==== first load data ======");
  console.log(form_storage);

  if (form_storage !== null) {

    //... initialize variable
    let tmpCheckboxCount = 1;
    let tmpRadioCount = 1;
    let tmpTextfieldCount = 1;
    let tmpComboCount = 1;
    let tmpListCount = 1;
    let tmpButtonCount = 1;
    let tmpDatefieldCount = 1;

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
      }

      if (item.form_type != RADIO) {
        x = item.x;
        y = item.y;
        width = item.xPage;
        height = item.form_type !== 10 ? item.yPage : 'auto'; //... fit signature height
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
          checkmark.classList.add("checkmark");
          checkbox.classList.add("checkbox");
          checkbox.appendChild(checkmark);
          if (item.isChecked) checkbox.classList.add("checked");
          checkbox.onclick = function () {
            current_form_id = id;
            toggleCheckbox(checkbox.id);
          };
          pg.append(checkbox);
          document.getElementById(
            "checkbox-field-input-name"
          ).value = item.formFieldName;
          document.getElementById(
            "checkbox-label"
          ).value = item.label;
          document.getElementById(
            "checkbox-value"
          ).value = item.value;
          current_checkbox_id = id;

          checkbox.addEventListener("click", () => {
            current_checkbox_id = id;
            DrawType = CHECKBOX;
          })

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
                      isOptionPane = true;
                      option = showOption(
                        CHECKBOX_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
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
          inputRadio.classList.add('radioinputchild');
          inputRadio.name = item.data.option;

          let spanElement = document.createElement("span");
          spanElement.classList.add("checkmark-radio");
          inputRadio.style.display = "none";
          spanElement.style.display = "none";

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
                      isOptionPane = true;
                      option = showOption(
                        RADIO_OPTION,
                        element.xPage / 2 - 180,
                        element.yPage + 15
                      );
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
          inputElement.classList.add("text-field-input");
          inputElement.style.display = "none";
          inputElement.addEventListener("input", function () {
            current_form_id = id;
            handleText();
          });

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

                      //... background color
                      document.getElementById("text-font-background-color").value =
                        element.textBackgroundColor;

                      let selected = element.align;
                      if (selected == ALIGN_LEFT)
                        document.getElementById("text-left").checked = true;
                      if (selected == ALIGN_CENTER)
                        document.getElementById("text-center").checked = true;
                      if (selected == ALIGN_RIGHT)
                        document.getElementById("text-right").checked = true;
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
          selectElement.classList.add("combobox-field-input");
          selectElement.style.display = "none";
          selectElement.addEventListener("change", function () {
            current_form_id = id;
            handleCombo();
          });
          // let pElement = document.createElement("p");
          // pElement.classList.add("combobox-field-value");
          // selectElement.style.display = "none";

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

                      //... background color
                      document.getElementById("combo-font-background-color").value =
                        element.textBackgroundColor;

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
                      comboDiv.append(option);
                    }
                  });

                  document
                    .getElementById("combo-save-button")
                    .addEventListener("click", handleCombo);

                  addDeleteButton(current_combo_id, tooltipbar, comboDiv, "combo");
                } else {
                  document
                    .getElementById("combo_tooltipbar" + current_combo_id)
                    .remove();
                }
              }
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
          dropList.classList.add("list-field-input");

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

                      //... background color
                      document.getElementById("list-font-background-color").value =
                        element.textBackgroundColor;

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
                      listDiv.append(option);
                    }
                  });
                  document
                    .getElementById("list-save-button")
                    .addEventListener("click", handleList);

                  addDeleteButton(current_list_id, tooltipbar, listDiv, "list");
                } else {
                  document
                    .getElementById("list_tooltipbar" + current_list_id)
                    .remove();
                }
              }
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
          buttonAction.classList.add("button-field-input");
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

                      //... background color
                      document.getElementById("button-font-background-color").value =
                        element.textBackgroundColor;

                      const selectedValue = document.getElementById("button-field-input-action") && document.getElementById("button-field-input-action").value;
                      if (element.action == SUBMIT) {
                        selectedValue.value = "submit";
                      } else if (element.action == RESET) {
                        selectedValue.value = "reset";
                      }
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
          const newDate = document.createElement("input");
          newDate.id = "datecontent" + id;
          newDate.style.position = "relative";
          newDate.type = "date";
          newDate.style.width = "100%";
          newDate.style.height = "100%";
          newDate.classList.add("textcontent");
          newDate.value = item.text;

          newDate.addEventListener("change", () => {
            let dateId = id;
            current_form_id = dateId;
            handleDate();
          });

          let dateDiv = document.createElement("div");
          dateDiv.id = "date" + id;
          addFormElementStyle(dateDiv, y, x, width, height);

          dateDiv.classList.add("textfield-content");
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

          newDate.style.fontFamily =
            document.getElementById("date-font-style").value;
          newDate.style.fontSize =
            document.getElementById("date-font-size").value + "px";
          newDate.style.color = document.getElementById("date-font-color").value;

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

          //... background color
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

                      //... background color
                      document.getElementById("date-font-background-color").value =
                        element.textBackgroundColor;

                      let selected = element.align;
                      if (selected == ALIGN_LEFT)
                        document.getElementById("date-left").checked = true;
                      if (selected == ALIGN_CENTER)
                        document.getElementById("date-center").checked = true;
                      if (selected == ALIGN_RIGHT)
                        document.getElementById("date-right").checked = true;
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
          // signatureContainer.className = "signatureDiv";
          signatureContainer.id = "signature" + id;
          addFormElementStyle(signatureContainer, y, x, width, height);
          signatureContainer.style.display = "flex";
          signatureContainer.style.alignItems = "center";
          signatureContainer.style.justifyContent = "center";
          signatureContainer.style.userSelect = "none";
          signatureContainer.style.color = "white";
          signatureContainer.style.minHeight = "40px";
          signatureContainer.textContent = "Double Click to sign here!";

          //... background color
          form_storage.map((element) => {
            if (element.id == id) {
              document.getElementById("signature-font-background-color").value =
                element.textBackgroundColor;

              if (isDraft == "false") {
                setTimeout(() => {
                  $("#" + element.containerId).css("background-color", element.textBackgroundColor);
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

          resizeCanvas(signatureContainer.id, SIGNATURE, id);
          signatureContainer.addEventListener("click", () => {
            if (!isEditing) {
              current_signature_id = id;


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
              document.getElementById("signature-create").onclick = function () {
                let canvas;
                if (currentSignType == DRAW) {
                  canvas = document
                    .getElementById("signature-draw-body")
                    .querySelector("canvas");
                  signatureImgData = cropCanvas(canvas);
                  handleSignature();
                  createAndAppendImage(signatureImgData);
                } else if (currentSignType == TYPE) {
                  canvas = document.getElementById("signature-type-canvas");
                  signatureImgData = cropCanvas(canvas);
                  handleSignature();
                  createAndAppendImage(signatureImgData);
                } else if (currentSignType == UPLOAD) {
                  const file = document.getElementById("signature-image-input")
                    .files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      signatureImgData = e.target.result;
                      handleSignature();
                      createAndAppendImage(signatureImgData);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    alert("Please select an image file.");
                  }
                } else if (currentSignType == PROFILE) {
                  if (selectedProfileSignature) {
                    signatureImgData = selectedProfileSignature;
                    handleSignature();
                    createAndAppendImage(selectedProfileSignature);
                  } else {
                    alert("Please select an image file.");
                  }
                }

                function createAndAppendImage(imgData) {
                  signature_creator.style.display = "none";
                  const signatureImg = document.createElement("img");
                  signatureImg.className = "signatureImg";
                  signatureImg.id = "signatureImg" + id;
                  signatureImg.style.width = "100%";
                  signatureImg.style.height = "100%";
                  signatureImg.src = imgData;
                  signatureImg.style.objectFit = "contain";

                  //... background color
                  // signatureImg.style.backgroundColor = document.getElementById("signature-font-background-color").value;

                  signatureContainer.textContent = "";
                  signatureContainer.append(signatureImg);
                  resizeCanvas(signatureContainer.id, SIGNATURE, id);
                }
              };
            }
          });
          break;
        case SHAPE:
          let canvas = $("#drawing-board").find("canvas")[0];
          canvas.width = item.canvasWidth * ratio;
          canvas.height = item.canvasHeight * ratio;
          const shapeImg = document.createElement("img");
          shapeImg.id = "shapeImg" + id;
          shapeImg.style.width = "100%";
          shapeImg.style.height = "100%";
          shapeImg.src = item.imgData;
          shapeImg.style.objectFit = "fill";

          const shapeContainer = document.createElement("div");
          shapeContainer.id = "shape" + id;
          shapeContainer.style.position = "absolute";
          shapeContainer.style.top = y + "px";
          shapeContainer.style.left = x + "px";
          shapeContainer.style.width = width + "px";
          shapeContainer.style.height = height + "px";
          shapeContainer.style.zIndex = standardZIndex;
          shapeContainer.tabIndex = 0;
          shapeContainer.classList.add("form-fields");

          shapeContainer.append(shapeImg);
          pg.appendChild(shapeContainer);
          resizeCanvas(shapeContainer.id, SHAPE, id);

          shapeContainer.addEventListener("dblclick", () => {
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
                let editBtn = document.createElement("button");
                editBtn.style.padding = "5px";
                editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
                $(editBtn).on("click", function () {
                  let targetShape = form_storage.filter(function (item) {
                    return item.id == parseInt(current_shape_id);
                  });
                  $("#drawing-board-container").css("display", "flex");
                  let targetCtx = canvas.getContext("2d");
                  $("#clear-canvas").click();
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
                    handleShape(shapeWidth, shapeHeight, item.canvasWidth, item.canvasHeight);
                  });
                });
                tooltipbar.append(editBtn);
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
          });
          $("#drawing-shape-create").off("click");
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
  }

  if (text_storage !== null) {
    text_storage.forEach((item) => {
      let id = item.id;
      let new_x_y, x, y, width, height;
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

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = y + "px";
      container.style.left = x + "px";
      container.style.width = "fit-content";
      container.style.height = "fit-content";
      container.style.zIndex = 101;
      container.tabIndex = 0;
      container.append(newText);
      pg.append(container);
      newText.style.fontFamily = item.regularFontStyle;
      newText.style.fontSize = item.baseFontSize;
      newText.style.color = item.textColor;
    })
  }
  generalUserMode();
}

//... Draw font family
const drawFontFamily = function () {
  toolbar.find("#toolbar-font-style").empty();
  fontStyleArr.forEach(function (item) {
    let option = "";
    if(item == "Calibri"){
      option = `<option value="${item}" style="font-family: ${item}" selected="selected">${item}</option>`;
    }else{
      option = `<option value="${item}" style="font-family: ${item}">${item}</option>`;
    }
    toolbar.find("#toolbar-font-style").append(option);
  })
}

//... Draw font size
const drawFontSize = function () {
  toolbar.find("#toolbar-font-size").empty();
  fontSizeArr.forEach(function (item) {
    let val = item == "Auto" ? 12 : item;
    let option = `<option value="${val}" pixel="${val}px">${item}</option>`;
    toolbar.find("#toolbar-font-size").append(option);
  })
}

//... Write Text Event
$(document).on("DOMSubtreeModified", ".freeTextEditor.selectedEditor", function () {
  let value = toolbar.find("#toolbar-font-size").val() == "" || toolbar.find("#toolbar-font-size").val() == null ? 12 : toolbar.find("#toolbar-font-size").val();

  let size = value + "px";
  let fontSize = `calc(${size} * var(--scale-factor))`;
  let fontFamily = toolbar.find("#toolbar-font-style").val();
  let fontWeight = toolbar.find("#text-bold").hasClass("active") ? 700 : 500;
  let fontStyle = toolbar.find("#text-italic").hasClass("active") ? "italic" : "";

  $(this).find(".internal[role='textbox']").attr('size', size);
  $(this).find(".internal[role='textbox']").css({ "font-size": fontSize, "font-family": fontFamily, "font-weight": fontWeight, "font-style": fontStyle });

  let changedText = $(this).find(".internal[role='textbox']").text();
  console.log("Changed text: " + changedText);

  console.log("baseid " + baseId);
  handleTrack(8, changedText)
  // $(this).find(".internal[role='textbox']").css({ "font-size": fontSize, "font-family": fontFamily, "font-style": fontStyle });
})

//... Change Font Size Event
$(document).on("change", "#toolbar-font-size", function () {
  if ($(".freeTextEditor").hasClass("selectedEditor")) {
    let value = $(this).val() == "" || $(this).val() == null ? 12 : $(this).val();
    let size = value + "px";
    let fontSize = `calc(value + "px"} * var(--scale-factor))`;
    $(".freeTextEditor.selectedEditor").find(".internal[role='textbox']").attr("size", size);
    $(".freeTextEditor.selectedEditor").find(".internal[role='textbox']").css("font-size", fontSize);
  }
})

//... Change Font Family Event
$(document).on("change", "#toolbar-font-style", function () {
  if ($(".freeTextEditor").hasClass("selectedEditor")) {
    let fontFamily = $(this).val();
    $(".freeTextEditor.selectedEditor").find(".internal[role='textbox']").css("font-family", fontFamily);
  }
})

//... Get Font Detail of Selected Text
$(document).on("click", ".freeTextEditor", function () {
  if (isOpenSubmitDocument) {
    return false
  }

  let size = $(this).find(".internal[role='textbox']").attr("size");
  let fontFamily = $(this).find(".internal[role='textbox']").css("font-family");
  let fontWeight = $(this).find(".internal[role='textbox']").css("font-weight");
  let fontStyle = $(this).find(".internal[role='textbox']").css("font-style");

  // var calcSize = fontSize / var(--scale-factor);

  toolbar.find(`#toolbar-font-size option[pixel="${size}"]`).prop("selected", true);
  toolbar.find(`#toolbar-font-style option[value="${fontFamily}"]`).prop("selected", true);

  if (fontWeight == 700) {
    toolbar.find("#text-bold").addClass("active")
  } else {
    toolbar.find("#text-bold").removeClass("active")
  }
  if (fontStyle == "italic") {
    toolbar.find("#text-italic").addClass("active")
  } else {
    toolbar.find("#text-italic").removeClass("active")
  }
})

//... Change Font Style Event
$(document).on("click", ".text-weight-button", function () {
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
  } else {
    $(this).addClass("active");
  }
  if ($(".freeTextEditor").hasClass("selectedEditor")) {
    let fontWeight = toolbar.find("#text-bold").hasClass("active") ? 700 : 500;
    let fontStyle = toolbar.find("#text-italic").hasClass("active") ? "italic" : "";
    $(".freeTextEditor.selectedEditor").find(".internal[role='textbox']").css({ "font-weight": fontWeight, "font-style": fontStyle });
    // $(".freeTextEditor.selectedEditor").find(".internal[role='textbox']").css({ "font-style": fontStyle });
  }
})

document.addEventListener("DOMContentLoaded", function () {
  loadFontFiles();
  drawFontFamily();
  drawFontSize();
  requestId = getIdFromUrl();

  let username = localStorage.getItem('username');

  var url = initialId && isDraft ? `${BASE_URL}/history/${username}/${initialId}` : `${BASE_URL}/getpdfdata?uniqueId=${requestId}`;

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
        form_storage = isDraft == "true" ? [] : isDraft == "" ? JSON.parse(data[0].formData) : JSON.parse(data.formData);
        clientName = isDraft == "" ? data[0].name : data.name;
        clientEmail = isDraft == "" ? data[0].email : data.email;

        // Handle the retrieved data from the backend
        const dataURI = isDraft ? data.pdfData : data[0].pdfData;
        const base64Data = dataURI.split(',')[1];
        // Decode base64 data to binary
        const binaryData = atob(base64Data);

        // Convert binary data to Uint8Array
        const array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          array[i] = binaryData.charCodeAt(i);
        }
        // Create Blob from Uint8Array
        const blob = new Blob([array], { type: 'application/pdf' });

        // Create File from Blob
        const fileName = 'downloaded.pdf';
        const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

        draw_form_storage = isDraft ? JSON.parse(data.formData) : JSON.parse(data[0].formData);
        text_storage = isDraft ? JSON.parse(data.textData) : JSON.parse(data[0].textData);
        PDFViewerApplication.open({
          url: URL.createObjectURL(pdfFile),
          originalUrl: pdfFile.name,
        });
        const checkViewerInterval = setInterval(() => {
          if (PDFViewerApplication.pdfDocument && PDFViewerApplication.pdfDocument.numPages > 0) {
            // If the document is loaded, call the drawFormElement function
            clearInterval(checkViewerInterval); // Clear the interval
            drawFormElement();

            //...
            isOpenSubmitDocument = isDraft == "false" ? true : false;
            $("body").removeClass("loading");
          }
        }, 100);
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

  //... background color
  textBackgroundColor = document.getElementById("checkbox-background-color") && document.getElementById("checkbox-background-color").value;

  if (isDraft != "false") {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].id == current_form_id) {
        form_storage[i].form_field_name = formFieldName;
        form_storage[i].textBackgroundColor = textBackgroundColor;

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
      width: formWidth * 0.75 * 0.75,
      height: formHeight * 0.75 * 0.75,
      xPage: formWidth,
      yPage: formHeight,
      isChecked: false,
      isReadOnly: false,
      label: label,
      value: value,

      //... background color
      textBackgroundColor: textBackgroundColor,
    });

    //... background color
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

  //... background color
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
          
          //... background color
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
        width: formWidth * 0.75 * 0.75,
        height: formHeight * 0.75 * 0.75,
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
  fontStyle = generateFontName("text-font-style");
  fontSize = document.getElementById("text-font-size") && parseInt(document.getElementById("text-font-size").value);
  const regularFont = document.getElementById("text-font-style") && document.getElementById("text-font-style").value;
  textColor = document.getElementById("text-font-color") && document.getElementById("text-font-color").value;

  //... background color
  textBackgroundColor = document.getElementById("text-font-background-color") && document.getElementById("text-font-background-color").value;

  let initialValue = "";
  const currentFormText = document.getElementById(`text${current_form_id}`);
  if (currentFormText) {
    initialValue = currentFormText.querySelector(".text-field-input").value;
  }

  if (isDraft != "false") {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].id == current_form_id) {
        form_storage[i].fontStyle = fontStyle;
        form_storage[i].fontSize = fontSize;
        form_storage[i].textColor = textColor;

        //... background color
        form_storage[i].textBackgroundColor = textBackgroundColor;

        form_storage[i].align = alignValue;
        form_storage[i].isBold = isBold;
        form_storage[i].isItalic = isItalic;
        form_storage[i].regularFontStyle = regularFont;
        form_storage[i].initialValue = initialValue;
        form_storage[i].form_field_name = formFieldName;

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
  } else {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].id == current_form_id) {
        form_storage[i].initialValue = initialValue;
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
      fontSize: fontSize,
      textColor: textColor,

      //... background color
      textBackgroundColor: textBackgroundColor,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });

    fontStyle = "";
    fontSize = 12;
    textColor = "";

    //... background color
    textBackgroundColor = "";

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
  fontStyle = generateFontName("combo-font-style");
  fontSize = document.getElementById("combo-font-size") && parseInt(document.getElementById("combo-font-size").value);
  const regularFont = document.getElementById("combo-font-style") && document.getElementById("combo-font-style").value;
  textColor = document.getElementById("combo-font-color") && document.getElementById("combo-font-color").value;

  //... background color
  textBackgroundColor = document.getElementById("combo-font-background-color") && document.getElementById("combo-font-background-color").value;

  let initialValue = comboboxOptionArray[0];
  const currentFormText = document.getElementById(`combo${current_form_id}`);
  if (currentFormText) {
    let currentValue = currentFormText.querySelector(".combobox-field-input").value;
    if (currentValue != "") initialValue = currentValue;
  }

  if (isDraft != "false") {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].form_type === COMBOBOX) {
        if (
          form_storage[i].form_field_name == formFieldName &&
          form_storage[i].id == current_form_id
        ) {
          form_storage[i].optionArray =
            form_storage[i].optionArray.concat(comboboxOptionArray);
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;

          //... background color
          form_storage[i].textBackgroundColor = textBackgroundColor;

          form_storage[i].regularFontStyle = regularFont;
          form_storage[i].initialValue = initialValue;
          form_storage[i].form_field_name = formFieldName;
          // form_storage[i].align = alignValue;
          comboboxOptionArray = [];

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
          if (formFieldName != "") form_storage[i].form_field_name = formFieldName;
          break;
        }
      }
    }
  } else {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].form_type === COMBOBOX) {
        if (form_storage[i].id == current_form_id) {
          form_storage[i].initialValue = initialValue;
          break;
        }
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

      //... background color
      textBackgroundColor: textBackgroundColor,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";

    //... background color
    textBackgroundColor = "";

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
  fontStyle = document.getElementById("list-font-style") && document.getElementById("list-font-style").value;
  fontSize = document.getElementById("list-font-size") && parseInt(document.getElementById("list-font-size").value);
  const regularFont = document.getElementById("list-font-style") && document.getElementById("list-font-style").value;
  textColor = document.getElementById("list-font-color") && document.getElementById("list-font-color").value;

  //... background color
  textBackgroundColor = document.getElementById("list-font-background-color") && document.getElementById("list-font-background-color").value;

  let initialValue = "";
  const currentFormText = document.getElementById(`list${current_form_id}`);
  if (currentFormText) {
    if (currentFormText.querySelector(".list-field-input").querySelector(".active"))
      initialValue = currentFormText.querySelector(".list-field-input").querySelector(".active").textContent;
  }

  if (isDraft != "false") {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].form_type === LIST) {
        if (
          form_storage[i].id == current_form_id
        ) {
          form_storage[i].optionArray =
            form_storage[i].optionArray.concat(listboxOptionArray);
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;

          //... background color
          form_storage[i].textBackgroundColor = textBackgroundColor;

          form_storage[i].regularFontStyle = regularFont;
          form_storage[i].initialValue = initialValue;
          form_storage[i].form_field_name = formFieldName;
          // form_storage[i].align = alignValue;
          listboxOptionArray = [];

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
          form_storage[i].optionArray =
            form_storage[i].optionArray.concat(listboxOptionArray);
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize;
          form_storage[i].textColor = textColor;

          //... background color
          form_storage[i].textBackgroundColor = textBackgroundColor;

          form_storage[i].regularFontStyle = regularFont;
          form_storage[i].initialValue = initialValue;
          form_storage[i].form_field_name = formFieldName;
          // form_storage[i].align = alignValue;
          listboxOptionArray = [];
          break;
        }
      }
    }
  } else {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].form_type === LIST) {
        if (
          form_storage[i].id == current_form_id
        ) {
          form_storage[i].initialValue = initialValue;
        }
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

      //... background color
      textBackgroundColor: textBackgroundColor,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";

    //... background color
    textBackgroundColor = "";

    alignValue = 0;
    listboxOptionArray = [];
    const date = new Date(Date.now());
    addHistory(baseId, LIST, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "list");
  }
  document
    .getElementById("list-save-button")
    .removeEventListener("click", handleCombo);
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
      } else {
        console.log("Child element with id " + item + "not found");
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

    fieldOption.style.top = y + "px";
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

  //... background color
  textBackgroundColor = document.getElementById("button-font-background-color") && document.getElementById("button-font-background-color").value;

  if (isDraft != "false") {
    for (let i = 0; i < form_storage.length; i++) {
      if (
        form_storage[i].form_field_name == formFieldName &&
        form_storage[i].id == current_form_id
      ) {
        form_storage[i].action = form_action;
        form_storage[i].fontStyle = fontStyle;
        form_storage[i].fontSize = fontSize;
        form_storage[i].textColor = textColor;

        //... background color
        form_storage[i].textBackgroundColor = textBackgroundColor;

        form_storage[i].text = initialValue;
        form_storage[i].align = alignValue;
        form_storage[i].form_field_name = formFieldName;

        //... handle track
        handleTrack(form_storage[i].id, initialValue + " Type " + selectedValue );

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
        form_storage[i].action = form_action;

        //... handle track
        handleTrack(form_storage[i].id, initialValue + " Type " + selectedValue);
        break;
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

      //... background color
      textBackgroundColor: textBackgroundColor,

      align: alignValue,
      xPage: formWidth,
      yPage: formHeight,
      isReadOnly: false,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";

    //... background color
    textBackgroundColor = "";

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

  //... background color
  textBackgroundColor = document.getElementById("date-font-background-color") && document.getElementById("date-font-background-color").value;

  const regularFont = document.getElementById("date-font-style") && document.getElementById("date-font-style").value;

  if (window.getComputedStyle(document.getElementById(DATE_OPTION)).getPropertyValue('display') !== "none"){
    document.getElementById(DATE_OPTION).style.display = "none";
  }
    
    if (isDraft != "false") {
      for (let i = 0; i < form_storage.length; i++) {
        if (
          form_storage[i].form_field_name == formFieldName &&
          form_storage[i].id == current_form_id
        ) {
          form_storage[i].fontStyle = fontStyle;
          form_storage[i].fontSize = fontSize * 0.75 * 0.8;
          form_storage[i].textColor = textColor;

          //... background color
          form_storage[i].textBackgroundColor = textBackgroundColor;

          form_storage[i].text = text;
          form_storage[i].form_field_name = formFieldName;
          
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

          //... handle track
          handleTrack(form_storage[i].id, formFieldName);
          break;
        }
      }
    } else {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].id == current_form_id) form_storage[i].text = text;
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
      fontSize: fontSize * 0.75 * 0.8,
      baseFontSize: fontSize,
      textColor: textColor,

      //... background color
      textBackgroundColor: textBackgroundColor,

      width: formWidth * 0.75 * 0.8,
      height: formHeight * 0.75 * 0.8,
      xPage: formWidth,
      yPage: formHeight,
    });
    fontStyle = "";
    fontSize = 12;
    textColor = "";

    //... background color
    textBackgroundColor = "";

    const date = new Date(Date.now());
    addHistory(baseId, DATE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "date");
  }
  document
    .getElementById("date-save-button")
    .removeEventListener("click", handleDate);
};

const handleSignature = function () {
  for (let i = 0; i < form_storage.length; i++) {
    if (
      form_storage[i].id == current_form_id
    ) {
      form_storage[i].imgData = signatureImgData;
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

  //... background color
  textBackgroundColor = document.getElementById("signature-font-background-color") && document.getElementById("signature-font-background-color").value;

  if (isDraft != "false") {
    for (let i = 0; i < form_storage.length; i++) {
      if (form_storage[i].id == current_form_id) {

        //... background color
        //... check if draw, type, upload
        if (form_storage[i].imgData.includes("data:image/png;base64")) {
          form_storage[i].textBackgroundColor = "#FFFFFF"
        } else {
          form_storage[i].textBackgroundColor = textBackgroundColor;
        }

        let sign_type = $(".signature-option .tablink-active").text();

        //... handle track
        handleTrack(form_storage[i].id, sign_type + " signature");
        break;
      }
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

      //... background color
      textBackgroundColor: textBackgroundColor,
    });
    const date = new Date(Date.now());
    addHistory(baseId, SIGNATURE, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "signature");
  }
};

// Resize and move canvas using Interact.js library.
const resizeCanvas = function (id, type, currentId, optionId) {
  let newX = 0,
    newY = 0;

  DrawType = type;
  const interactInstance = interact(`#${id}`)
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
          }
        },
        end(event) {
          if (!isEditing) {
            const target = event.target;
            var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
            var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
            moveEventHandler(event, newX, newY, currentId);
          }
        },
      },
    });
};

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
    document.getElementById(`shape_tooltipbar${current_form_id}`)
  ];
  const optionElements = [checkboxOption, radioOption, textFieldOption, comboOption, listOption, buttonOption, dateOption, textContentOption];
  const handlers = [handleCheckbox, handleRadio, handleText, handleCombo, handleList, handleButton, handleDate, handleTextContent];

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
  if (form_storage.length != 0) {
    form_storage.forEach((item) => {
      let currentItem = document.getElementById(item.containerId);
      if (currentItem) {
        currentItem.style.zIndex = standardZIndex;
        if (currentItem.classList.contains("textfield-content"))
          currentItem.classList.remove("textfield-content");
      }
    })
  }
  if (text_storage.length != 0) {
    text_storage.forEach((item) => {
      let currentItem = document.getElementById(item.containerId);
      if (currentItem) {
        // currentItem.style.zIndex = standardZIndex;
        if (currentItem.classList.contains("textfield-content"))
          currentItem.classList.remove("textfield-content");
      }
    })
  }
}

const removeAllResizeBar = function () {
  if (form_storage !== null) {
    form_storage.forEach((item) => {
      let currentItem;
      if (item.form_type === DATE) currentItem = document.getElementById(item.containerId) && document.getElementById(item.containerId).parentElement;
      else currentItem = document.getElementById(item.containerId);
      if (currentItem && currentItem.querySelector("#topLeft")) {
        removeResizebar(currentItem.id);
      }
    })
  }
  if (text_storage !== null) {
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
  if (type !== TEXTFIELD && type !== TEXT_CONTENT) {
    document.getElementById(`replyInput${baseId}`).focus();
  }
}

document.getElementById("viewer").addEventListener("mousedown", function (event) {
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
  if (form_storage !== null) {
    form_storage.forEach((item) => {
      if (item.containerId === currentObject.id || item.containerId === currentObjectParentId) {
        currentFormType = item.form_type;
        DrawType = item.form_type;
        isExisting = true;
      }
    })
  }
  if (text_storage !== null) {
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
        if (!currentObject.parentElement.querySelector("#topLeft")) addResizebar(currentObject.parentElement.id);
        currentObject.parentElement.style.zIndex = selectedZIndex;
      } else if (currentFormType === SIGNATURE || currentFormType === SHAPE) {
        if (currentObject.tagName === "IMG") {
          if (!currentObject.parentElement.querySelector("#topLeft")) addResizebar(currentObject.parentElement.id);
          currentObject.parentElement.style.zIndex = selectedZIndex;
        } else {
          if (!currentObject.querySelector("#topLeft")) addResizebar(currentObject.id);
          currentObject.style.zIndex = selectedZIndex;
        }
      } else if (currentFormType == TEXT_CONTENT) {
        if (!currentObject.parentElement.classList.contains("textfield-content"))
          currentObject.parentElement.classList.add("textfield-content");
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
        item.data.width = width * 0.75 * 0.75;
        item.data.height = height * 0.75 * 0.75;
        item.data.xPage = width;
        item.data.yPage = height;
      }
    });
  } else if (DrawType == TEXT_CONTENT) {
    text_storage.map(function (item) {
      if (item.id === currentId) {
        item.width = width * 0.75 * 0.75;
        item.height = height * 0.75 * 0.75;
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

const hexToRgb = function (hex) {
  // Remove the '#' at the beginning if present
  hex = hex.replace("#", "");

  // Parse the hexadecimal color components
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return { r, g, b };
};

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
  }
};

// Add Delete button and define action.
const addDeleteButton = function (currentId, container, object, type) {
  const left = object.offsetWidth;
  const top = object.offsetHeight;

  container.id = `${type}_tooltipbar` + currentId;
  container.style.position = "absolute";
  container.style.zIndex = standardZIndex;
  container.style.top = -10 - parseInt(top) + "px";
  container.style.left = "0px";
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.alignItems = "center";
  container.style.gap = "5px";
  container.style.height = parseInt(top) + "px";
  container.classList.add("delete-button");
  let deleteBtn = document.createElement("button");
  deleteBtn.style.padding = "5px";
  deleteBtn.innerHTML = `<i class="fas fa-trash-can"></i>`;

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    let currentObject;

    currentId = container.id.replace(`${type}_tooltipbar`, "");
    const target = document.getElementById(`${type}` + currentId);
    if (target && document.getElementById("topLeft"))
      removeResizebar(target.id);
    target.style.display = "none";
    if (type == "text-content") {
      currentObject = text_storage.find((item) => item.id = currentId);
      text_storage = text_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
    } else if (type == "comment") {
      currentObject = comment_storage.find((item) => item.id = currentId);
      comment_storage = comment_storage.filter(function (comment) {
        return comment.id !== parseInt(currentId);
      });
    } else {
      currentObject = form_storage.find((item) => item.id = currentId);
      form_storage = form_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
    }
    const commentPageDiv = document.getElementById(`page${currentObject.page_number}`);
    const currentHistoryDiv = document.getElementById(`historyDiv${currentId}`);
    if (commentPageDiv && commentPageDiv.contains(currentHistoryDiv)) {
      commentPageDiv.removeChild(currentHistoryDiv);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (type != "text-content" && e.key === "Delete") {
      currentId = container.id.replace(`${type}_tooltipbar`, "");
      document.getElementById(`${type}` + currentId).style.display = "none";
      form_storage = form_storage.filter(function (item) {
        return item.id !== parseInt(currentId);
      });
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

const addFormElementStyle = function (object, top, left, width, height) {
  object.style.position = "absolute";
  object.style.top = top + "px";
  object.style.left = left + "px";
  object.style.width = width + "px";
  object.style.height = height + "px";
  object.style.background = "#3C97FE";
  object.style.zIndex = standardZIndex;
  object.tabIndex = 0;
  object.style.borderRadius = "3px";
  object.classList.add("form-fields");
};

//...
const addSignatureElementStyle = function (object, top, left, width, minHeight) {
  object.style.position = "absolute";
  object.style.top = top + "px";
  object.style.left = left + "px";
  object.style.width = width + "px";
  object.style.minHeight = minHeight + "px";
  object.style.background = "#3C97FE";
  object.style.zIndex = standardZIndex;
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
  const comboValue = document.querySelectorAll(".combobox-field-value");
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
    toTransparent(currentItem);
    switch (item.form_type) {
      case CHECKBOX:
        break;
      case RADIO:
        // toTransparent(currentItem.querySelector(".radioinputchild"));
        // toTransparent(currentItem.querySelector(".checkmark-radio"));
        break;
      case TEXTFIELD:
        // toTransparent(currentItem.querySelector(".text-field-input"));
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
        break;
      case BUTTON:
        currentItem.remove();
        break;
      default:
        break;
    }
  })
  form_storage = form_storage.filter((item) => {
    return item.form_type !== BUTTON;
  })
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
      checkmark.classList.add("checkmark");
      checkmark.style.display = 'none';
      checkbox.classList.add("checkbox");
      checkbox.appendChild(checkmark);
      checkbox.onclick = function () {
        current_form_id = checkboxId;
        toggleCheckbox(checkbox.id);
      };

      pg.appendChild(checkbox);

      showOptionAndResizebar(CHECKBOX_OPTION, checkbox, formWidth, formHeight);

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

                  //... background color
                  document.getElementById("checkbox-background-color").value =
                    element.textBackgroundColor;

                  isOptionPane = true;
                  option = showOption(
                    CHECKBOX_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
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
      inputRadio.classList.add('radioinputchild');
      inputRadio.name = `Radio Group Form Field ${radioId}`;

      let spanElement = document.createElement("span");
      spanElement.classList.add("checkmark-radio");

      inputRadio.style.display = "none";
      spanElement.style.display = "none";

      radio.append(inputRadio, spanElement);
      radio.onclick = function () {
        current_form_id = radioId;
        selectRadioButton(this, radioId);
      };

      pg.appendChild(radio);

      showOptionAndResizebar(RADIO_OPTION, radio, formWidth, formHeight)

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

                  //... background color
                  document.getElementById("checkbox-background-color").value =
                    element.textBackgroundColor;
                    
                  isOptionPane = true;
                  option = showOption(
                    RADIO_OPTION,
                    element.xPage / 2 - 180,
                    element.yPage + 15
                  );
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
      inputElement.classList.add("text-field-input");
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

                  //... background color
                  document.getElementById("text-font-background-color").value =
                    element.textBackgroundColor;

                  let selected = element.align;
                  if (selected == ALIGN_LEFT)
                    document.getElementById("text-left").checked = true;
                  if (selected == ALIGN_CENTER)
                    document.getElementById("text-center").checked = true;
                  if (selected == ALIGN_RIGHT)
                    document.getElementById("text-right").checked = true;
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
      selectElement.classList.add("combobox-field-input");
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

                  //... background color
                  document.getElementById("combo-font-background-color").value =
                    element.textBackgroundColor;

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
                  comboDiv.append(option);
                }
              });

              document
                .getElementById("combo-save-button")
                .addEventListener("click", handleCombo);

              addDeleteButton(current_combo_id, tooltipbar, comboDiv, "combo");
            } else {
              document
                .getElementById("combo_tooltipbar" + current_combo_id)
                .remove();
            }
          }
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
      dropList.classList.add("list-field-input");

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

                  //... background color
                  document.getElementById("list-font-background-color").value =
                    element.textBackgroundColor;

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
                  listDiv.append(option);
                }
              });
              document
                .getElementById("list-save-button")
                .addEventListener("click", handleList);

              addDeleteButton(current_list_id, tooltipbar, listDiv, "list");
            } else {
              document
                .getElementById("list_tooltipbar" + current_list_id)
                .remove();
            }
          }
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
      buttonAction.classList.add("button-field-input");
      buttonAction.style.display = "none";
      buttonAction.addEventListener("click", function (event) {
        let parentElement = event.target.parentNode;
        let newId = parentElement.id.replace("button", "");
        if (form_storage !== null) {
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

                  //... background color
                  document.getElementById("button-font-background-color").value =
                    element.textBackgroundColor;

                  const selectedValue = document.getElementById("button-field-input-action") && document.getElementById("button-field-input-action").value;
                  if (element.action == SUBMIT) {
                    selectedValue.value = "submit";
                  } else if (element.action == RESET) {
                    selectedValue.value = "reset";
                  }
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
        }
      });

      handleButton();

      // const buttonValue = document.getElementById("button-text");
      // buttonValue.addEventListener('change', () => {
      //     document.getElementById(buttonDiv.id).textContent = buttonValue.value;
      // })

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
      newDate.style.position = "relative";
      newDate.type = "date";
      newDate.style.width = "100%";
      newDate.style.height = "100%";
      newDate.classList.add("textcontent");
      newDate.value = formattedDate;

      newDate.addEventListener("change", () => {
        let dateId = baseId;
        current_form_id = dateId;
        handleDate();
      });

      let dateDiv = document.createElement("div");
      dateDiv.id = "date" + dateId;
      addFormElementStyle(dateDiv, topPos, leftPos, formWidth, formHeight);

      dateDiv.classList.add("textfield-content");
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

      newDate.style.fontFamily =
        document.getElementById("date-font-style").value;
      newDate.style.fontSize =
        document.getElementById("date-font-size").value + "px";
      newDate.style.color = document.getElementById("date-font-color").value;

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

      //... background color
      document
        .getElementById("date-font-background-color")
        .addEventListener("change", () => {
          document.getElementById(current_date_content_id).style.backgroundColor =
            document.getElementById("date-font-background-color").value;
        });

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

                  //... background color
                  document.getElementById("date-font-background-color").value =
                    element.textBackgroundColor;

                  let selected = element.align;
                  if (selected == ALIGN_LEFT)
                    document.getElementById("date-left").checked = true;
                  if (selected == ALIGN_CENTER)
                    document.getElementById("date-center").checked = true;
                  if (selected == ALIGN_RIGHT)
                    document.getElementById("date-right").checked = true;
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

      //...
      addSignatureElementStyle(
        signatureContainer,
        topPos,
        leftPos,
        formWidth,
        formHeight
      );
      signatureContainer.style.display = "flex";
      signatureContainer.style.alignItems = "center";
      signatureContainer.style.justifyContent = "center";
      signatureContainer.style.userSelect = "none";
      signatureContainer.style.color = "white";
      signatureContainer.style.minHeight = "40px";
      signatureContainer.textContent = "Double Click to sign here!";

      pg.appendChild(signatureContainer);
      handleSignature();

      current_signature_id = signatureId;

      resizeCanvas(signatureContainer.id, SIGNATURE, signatureId);
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
          document.getElementById("signature-create").onclick = function () {
            let canvas;
            signature_creator.style.display = "none";
            if (currentSignType == DRAW) {
              canvas = document
                .getElementById("signature-draw-body")
                .querySelector("canvas");
              signatureImgData = cropCanvas(canvas);
              handleSignature();
              createAndAppendImage(signatureImgData, signatureContainer, signatureId);
            } else if (currentSignType == TYPE) {
              canvas = document.getElementById("signature-type-canvas");
              signatureImgData = cropCanvas(canvas);
              handleSignature();
              createAndAppendImage(signatureImgData, signatureContainer, signatureId);
            } else if (currentSignType == UPLOAD) {
              const file = document.getElementById("signature-image-input")
                .files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                  signatureImgData = e.target.result;
                  handleSignature();
                  createAndAppendImage(signatureImgData, signatureContainer, signatureId);
                };
                reader.readAsDataURL(file);
              } else {
                alert("Please select an image file.");
              }
            } else if (currentSignType == PROFILE) {
              if (selectedProfileSignature) {
                signatureImgData = selectedProfileSignature;
                handleSignature();
                createAndAppendImage(selectedProfileSignature, signatureContainer, signatureId);
              } else {
                alert("Please select an image file.");
              }
            }
          };
        }
      });
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
  signatureImg.style.objectFit = "contain";
  container.textContent = "";
  container.append(signatureImg);
  resizeCanvas(container.id, SIGNATURE, id);
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
  console.log(form);
  form.flatten();
  pdfBytes = await pdfDoc.save();
  if (form_storage.length != 0)
    addFormElements().then(() => {
      add_txt_comment();
    });
  else {
    add_txt_comment();
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
  let imgData = form_item.imgData;

  if (!imgData.includes("data:image/png;base64")) {
    imgData = $("#" + form_item.containerId).find("img").attr("src");
  }

  const [r, g, b] = hexToRgb1(form_item.textBackgroundColor);

  try {
    const pngImage = await pdfDoc.embedPng(imgData);

    page.drawRectangle({
      x: form_item.x,
      y: form_item.y - form_item.height,
      width: form_item.width,
      height: form_item.height,
      color: PDFLib.rgb(r, g, b),
    });

    page.drawImage(pngImage, {
      x: form_item.x,
      y: form_item.y - form_item.height,
      width: form_item.width,
      height: form_item.height,
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
  if (form_storage.length != 0) {
    form_storage.map(async (form_item) => {
      page = pdfDoc.getPage(form_item.page_number - 1);
      if (form_item.form_type == RADIO) {
        if (radioOption != form_item.data.option) {
          radioOption = form_item.data.option;
          radioForm = form.createRadioGroup(radioOption);
        }
      }
      let customFont = "";
      if (
        form_item.form_type != CHECKBOX &&
        form_item.form_type != RADIO &&
        form_item.form_type != SIGNATURE &&
        form_item.form_type != SHAPE
      ) {
        const fontName = form_item.fontStyle;
        if (fontStyles.hasOwnProperty(fontName)) {
          selectedFont = fontStyles[fontName];
        } else {
          const fontByte = font_storage.find(
            (font) => font.fontName === fontName
          );
          selectedFont = fontByte.fontArrayBuffer;
        }
        customFont = await pdfDoc.embedFont(selectedFont);
        var { r, g, b } = hexToRgb(form_item.textColor);
      }
      switch (form_item.form_type) {
        case CHECKBOX:
          checkboxForm = form.createCheckBox(form_item.form_field_name);
          if (form_item.isReadOnly) {
            if (form_item.isChecked) {
              checkboxForm.addToPage(page, {
                x: form_item.x,
                y: form_item.y - form_item.height,
                width: form_item.width,
                height: form_item.height,
                backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
                borderColor: hexToRgbNew(form_item.textBackgroundColor),
              });
              checkboxForm.check();
              checkboxForm.enableReadOnly();
            }
          } else {
            checkboxForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.textBackgroundColor),
            });
            if (form_item.isChecked) checkboxForm.check();
          }
          break;
        case RADIO:
          if (form_item.data.isReadOnly) {
            if (form_item.data.isChecked) {
              radioForm.addOptionToPage(radioCount + "", page, {
                x: form_item.data.x,
                y: form_item.data.y - form_item.data.height,
                width: form_item.data.width,
                height: form_item.data.height,
                backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              });
              radioForm.select(radioCount + "");
            }
          } else {
            radioForm.addOptionToPage(radioCount + "", page, {
              x: form_item.data.x,
              y: form_item.data.y - form_item.data.height,
              width: form_item.data.width,
              height: form_item.data.height,
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
            });
            if (form_item.data.isChecked) {
              radioForm.select(radioCount + "");
            }
          }
          radioCount++;
          break;
        case DATE:
          if (!form_item.isReadOnly) {
            datefieldForm = form.createTextField(form_item.form_field_name);
            datefieldForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.textBackgroundColor),
            });
            datefieldForm.setFontSize(form_item.fontSize);
            datefieldForm.setText(form_item.text);
            datefieldForm.updateAppearances(customFont);
            datefieldForm.defaultUpdateAppearances(customFont);
            datefieldForm.enableReadOnly();
          } else {
            page.drawText(form_item.text, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
            });
          }
          break;
        case TEXTFIELD:
          if (!form_item.isReadOnly) {
            textfieldForm = form.createTextField(form_item.form_field_name);
            textfieldForm.setText(form_item.initialValue);
            textfieldForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              size: form_item.fontSize,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.textBackgroundColor),
            });
            textfieldForm.setFontSize(form_item.fontSize);
            textfieldForm.updateAppearances(customFont);
            textfieldForm.defaultUpdateAppearances(customFont);
          } else {
            page.drawText(form_item.initialValue, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
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
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderWidth: 1,
              borderColor: hexToRgbNew(form_item.textBackgroundColor),
            });
            comboboxForm.setFontSize(form_item.fontSize);
            comboboxForm.updateAppearances(customFont);
            comboboxForm.defaultUpdateAppearances(customFont);            
          } else {
            page.drawText(form_item.initialValue, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
            });
          }
          break;
        case LIST:
          if (!form_item.isReadOnly) {
            listboxForm = form.createOptionList(form_item.form_field_name);
            listboxForm.addOptions(form_item.optionArray);
            listboxForm.addToPage(page, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              height: form_item.height,
              size: form_item.fontSize,
              textColor: hexToRgbNew(form_item.textColor),
              backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
              borderColor: hexToRgbNew(form_item.textBackgroundColor),
            });
            listboxForm.setFontSize(12);
            listboxForm.updateAppearances(customFont);
            listboxForm.defaultUpdateAppearances(customFont);
            if (form_item.initialValue)
              listboxForm.select(form_item.initialValue);
          } else {
            page.drawText(form_item.initialValue, {
              x: form_item.x,
              y: form_item.y - form_item.height,
              width: form_item.width,
              size: form_item.fontSize,
              color: hexToRgbNew(form_item.textColor),
            });
          }
          break;
        case BUTTON:
          buttonfieldForm = form.createButton(form_item.form_field_name);
          buttonfieldForm.addToPage(form_item.text, page, {
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
            textColor: hexToRgbNew(form_item.textColor),
            backgroundColor: hexToRgbNew(form_item.textBackgroundColor),
          });
          buttonfieldForm.setFontSize(form_item.fontSize);
          buttonfieldForm.updateAppearances(customFont);
          buttonfieldForm.defaultUpdateAppearances(customFont);
          let formScript = "";
          if (form_item.action == SUBMIT) {
            formScript = `
                            for (var i = 0; i < this.numFields; i++) {
                                var fieldName = this.getNthFieldName(i);
                                var field = this.getField(fieldName);
                                field.readonly = true;
                                field.lineWidth = 0;
                                field.fillColor = color.transparent;
                                field.strokeColor = color.transparent;
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
          }

          break;
        case SHAPE:
          const shapeImage = await pdfDoc.embedPng(form_item.imgData);
          page.drawImage(shapeImage, {
            x: form_item.x,
            y: form_item.y - form_item.height,
            width: form_item.width,
            height: form_item.height,
          });
          break;
        default:
          break;
      }
    });
  }
  if (text_storage.length != 0) {comboDiv
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
          color: PDFLib.rgb(r, g, b),
          lineHeight: 10,
          // wordBreaks: true,
        });
      })
    );
  }
  pdfBytes = await pdfDoc.save();
}

const changeMode = () => {
  const switchEditInsert = document.getElementById("switchEditInsert");
  const formfields = document.querySelectorAll(".form-fields");
  const checkfields = document.querySelectorAll(".checkmark");
  const radiofields1 = document.querySelectorAll(".radioinputchild");
  const radiofields2 = document.querySelectorAll(".checkmark-radio");
  const textfields = document.querySelectorAll(".text-field-input");
  const combofields = document.querySelectorAll(".combobox-field-input");
  const combovalues = document.querySelectorAll(".combobox-field-value");
  const listfields = document.querySelectorAll(".list-field-input");
  const buttonfields = document.querySelectorAll(".button-field-input");
  const textcontentfields = document.querySelectorAll(".textcontent");
  const signatureImages = document.querySelectorAll(".signatureImg");
  if (isEditing) {
    switchEditInsert.innerHTML = `
      <p>Edit Mode</p>
      <i class="fa fa-toggle-off"></i>
    `;
    isEditing = false;
    sidebar.querySelectorAll("button").forEach((item) => {
      item.disabled = false;
    });

    formfields.forEach((item) => {
      item.style.background = "#3C97FE";
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

    textcontentfields.forEach((item) => { item.contentEditable = "true" });

  } else {
    switchEditInsert.innerHTML = `
    <p>Normal Mode</p>
    <i class="fa fa-toggle-on"></i>
    `;
    isEditing = true;
    sidebar.querySelectorAll("button").forEach((item) => {
      item.disabled = true;
    });
    // Disable resize and move for all form fields
    formfields.forEach((item) => {
      if (item.querySelector("#topLeft")) removeResizebar(item.id);
      if (item.querySelector(".delete-button")) item.querySelector(".delete-button").remove();
      item.style.background = "white";
      item.style.border = "1px solid #3C97FE";
      item.style.color = "#3C97FE";
    });
    // Enable all checkbox and radio field to input
    checkfields.forEach((item) => {
      item.style.display = "flex";

      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("checkbox", "");
          if (formItem.id == formId) {
            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        })
      }
    });
    radiofields1.forEach((item) => {
      item.style.display = "inline-block";

      //... background color
      item.style.backgroundColor = item.textBackgroundColor;
    });
    radiofields2.forEach((item) => {
      item.style.display = "inline-block";

      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("radio", "");
          if (formItem.id == formId) {
            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        })
      }
    });
    // Enable all text field to input
    textfields.forEach((item) => {
      item.style.display = "block";
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("text", "");
          if (formItem.id == formId) {
            // if(formItem.isBold) item.style.fontWeight = "bold";
            // else item.style.fontWeight = "normal";
            // if(formItem.isItalic) item.style.fontStyle = "italic";
            // else item.style.fontStyle = "normal";
            item.style.fontSize = formItem.fontSize + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;
            if (formItem.align == 0) item.style.textAlign = "left";
            else if (formItem.align == 1) item.style.textAlign = "center";
            else if (formItem.align == 2) item.style.textAlign = "right";

            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        });
      }
    });
    // Enable all combobox fields
    combofields.forEach((item) => {
      item.style.display = "block";
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("combo", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize + "px";
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

            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        });
      }
    });
    combovalues.forEach((item) => {
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("combo", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;

            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        });
      }
    });
    // Enable all listbox fields
    listfields.forEach((item) => {
      let activeElement = null;
      item.style.display = "block";
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("list", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize + "px";
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

            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        });
      }
    })
    // Enable all button fields
    buttonfields.forEach((item) => {
      item.style.display = "flex";
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("button", "");
          if (formItem.id == formId) {
            item.style.fontSize = formItem.fontSize + "px";
            item.style.color = formItem.textColor;
            item.style.fontFamily = formItem.regularFontStyle;
            item.textContent = formItem.text;

            //... background color
            item.style.backgroundColor = formItem.textBackgroundColor;
            item.style.border = "none";
          }
        })
      }
    })

    //... Enable all button fields
    textcontentfields.forEach((item) => {
      item.contentEditable = "false";
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("date", "");
          if (formItem.id == formId) {
            item.style.color = formItem.textColor;
            item.style.backgroundColor = formItem.textBackgroundColor;
          }
        })
      }
    });
    signatureImages.forEach((item) => {
      item.contentEditable = "false";
      if (form_storage !== null) {
        form_storage.forEach((formItem) => {
          let formId = item.parentNode.id.replace("signature", "");
          if (formItem.id == formId) {
            item.style.backgroundColor = formItem.textBackgroundColor;
          }
        })
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
    if (form_storage.length != 0) {
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
    if(id === index){
      $(this).find(".actiontext").text(value);
    }
  })
}