let comment_control = document.getElementById("comment_control_panel");

let comment_x = 0, comment_y = 0;

let pdfBytes;

let mouse_x = 0;
let mouse_y = 0;

let current_comment_id = 0;
let current_text_container_id = "";
let current_text_content_id = "";
let current_text_num_id = 0;

let isDragging = false;
let DrawType = "nothing";
let initialX, initialY;

let isBold = false;
let isItalic = false;
let isUnderline = false;
//////////

const getPageWidth = async function () {
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();
  pageWidth = width;
  pageHeight = height;
};

const loadFontFiles = function () {
  fontLists.forEach((item) => {
    fetch(`./fonts/${item.fontURL}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        font_storage.push({
          fontName: item.fontName,
          fontArrayBuffer: arrayBuffer,
        });
      })
      .catch((error) => {
        console.error("Error fetching TTF file:", error);
      });
  });
};

const generateFontName = function (id) {
  let fontName = document.getElementById(id) && document.getElementById(id).value;
  const fontStyles = {
    Bold: "Bold",
    Oblique: "Oblique",
    Italic: "Italic",
    BoldOblique: "BoldOblique",
    BoldItalic: "BoldItalic",
  };

  let selectedStyle = "";
  if (isBold && isItalic) {
    selectedStyle = fontName === fontStyleArr[2] ? "BoldItalic" : "BoldOblique";
  } else if (isBold) {
    selectedStyle = "Bold";
  } else if (isItalic) {
    selectedStyle = fontName === fontStyleArr[2] ? "Italic" : "Oblique";
  }

  if (isBold || isItalic) {
    fontName += fontStyles[selectedStyle];
  }
  return fontName;
};

const handleBold = function () {
  const boldBtn = document.getElementById("text-bold");
  if (isBold) {
    if (boldBtn) {
      boldBtn.classList.remove("active");
    }
    document.getElementById(current_text_content_id).classList.remove("bold-text");
    isBold = false;
  } else {
    if (boldBtn) {
      boldBtn.classList.add("active");
    }
    document.getElementById(current_text_content_id).classList.add("bold-text");
    isBold = true;
  }
  // saveTextContent();
};
const handleItalic = function () {
  const italicBtn = document.getElementById("text-italic");
  if (isItalic) {
    if (italicBtn) {
      italicBtn.classList.remove("active");
    }
    document.getElementById(current_text_content_id).classList.remove("italic-text");
    isItalic = false;
  } else {
    if (italicBtn) {
      italicBtn.classList.add("active");
    }
    document.getElementById(current_text_content_id).classList.add("italic-text");
    isItalic = true;
  }
  // saveTextContent();
};
const handleUnderline = function () {
  const underlineBtn = document.getElementById("text-underline");
  if (isUnderline) {
    if (underlineBtn) {
      underlineBtn.classList.remove("active");
    }
    document.getElementById(current_text_content_id).classList.remove("underline-text");
    isUnderline = false;
  } else {
    if (underlineBtn) {
      underlineBtn.classList.add("active");
    }
    document.getElementById(current_text_content_id).classList.add("underline-text");
    isUnderline = true;
  }
};

const addBoldItalicEvent = function () {
  $("#text-bold").click(function(){
    handleBold();
  })
  $("#text-italic").click(function(){
    handleItalic();
  })
  $("#text-underline").click(function(){
    handleUnderline();
  })
};

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "b") {
    event.preventDefault();
    handleBold();
  }
  if (event.ctrlKey && event.key === "i") {
    event.preventDefault();
    handleItalic();
  }
});
const removeBoldItalicEvent = function () {
  const boldBtn = document.getElementById("text-bold");
  const italicBtn = document.getElementById("text-italic");
  const underlineBtn = document.getElementById("text-underline");
  boldBtn.removeEventListener("click", handleBold);
  italicBtn.removeEventListener("click", handleItalic);
  underlineBtn.removeEventListener("click", handleUnderline);
  if (isBold) {
    boldBtn.classList.remove("active");
  }
  if (isItalic) {
    italicBtn.classList.remove("active");
  }
  if (isUnderline) {
    underlineBtn.classList.remove("active");
  }
  (isBold = false), (isItalic = false), (isUnderline = false);
};

const saveTextContent = function () {
  fontStyle = generateFontName("text-content-font-style");
  fontSize = document.getElementById("text-content-font-size") && parseInt(document.getElementById("text-content-font-size").value);
  textColor = document.getElementById("text-field-font-colorpicker") && document.getElementById("text-field-font-colorpicker").value;
  const regularFont = document.getElementById("text-content-font-style") && document.getElementById("text-content-font-style").value;
  let text, lines;
  const resultArray = [];
  let prevElement = null;
  const currentTextContent = document.getElementById(current_text_content_id);
  
  
  if(currentTextContent) {
    text = currentTextContent.innerText;
    lines = text.split("\n").map((line) => line.trim().replace(/\n/g, ""));
    for (const element of lines) {
      if (element !== "" || prevElement !== "") {
        resultArray.push(element);
      }
      prevElement = element;
    }
  }

  let count = 0;

  if(text_storage){
    for (let i = 0; i < text_storage.length; i++) {
      if (text_storage[i].id == current_text_num_id) {
        text_storage[i].fontStyle = fontStyle;
        text_storage[i].regularFontStyle = regularFont;
        text_storage[i].fontSize = fontSize;
        text_storage[i].textColor = textColor;
        text_storage[i].text = resultArray;
        text_storage[i].isBold = isBold;
        text_storage[i].isItalic = isItalic;
        text_storage[i].isUnderline = isUnderline;
        text_storage[i].width = textContentSize.x * 0.75 * 0.75;
        text_storage[i].height = textContentSize.y * 0.75 * 0.75;
        text_storage[i].xPage = textContentSize.x;
        text_storage[i].yPage = textContentSize.y;
        break;
      } else {
        count++;
      }
    }

    if (baseId !== 0 && (count == text_storage.length || text_storage == null) && isDelete === false) {      
      text_storage.push({
        id: baseId,
        containerId: "text-content" + baseId,
        textContentId: "textcontent" + baseId,
        historyId: "historyDiv" + baseId,
        form_type: TEXT_CONTENT,
        page_number: PDFViewerApplication.page,
        text: resultArray,
        x: pos_x_pdf,
        y: pos_y_pdf,
        baseX: pos_x_pdf,
        baseY: pos_y_pdf,
        fontStyle: fontStyle,
        regularFontStyle: regularFont,
        isBold: isBold,
        isItalic: isItalic,
        isUnderline: isUnderline,
        fontSize: fontSize,
        baseFontSize: fontSize,
        textColor: textColor,
        width: textContentSize.x * 0.75 * 0.75,
        height: textContentSize.y * 0.75 * 0.75,
        xPage: textContentSize.x,
        yPage: textContentSize.y,
      });
      fontStyle = "";
      fontSize = 12;
      textColor = "";
      const date = new Date(Date.now());
      addHistory(baseId, TEXT_CONTENT, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "text-content", "text content");
    }

    isDelete = false;
  }
}

const handleTextContent = (e) => {
  isOptionPane = false;
  if (document.getElementById(TEXT_CONTENT_OPTION)) document.getElementById(TEXT_CONTENT_OPTION).style.display = "none";
  if (e) e.stopPropagation();
  
  saveTextContent();

  document
    .getElementById("text-content-save-button")
    .removeEventListener("click", handleTextContent);
  removeBoldItalicEvent();
};

document.getElementById("outerContainer").appendChild(comment_control);

let computePageOffset = function () {
  let pageId = String(PDFViewerApplication.page);
  let pg = document.getElementById(pageId);
  var rect = pg.getBoundingClientRect(),
    bodyElt = document.body;
  return {
    top: rect.top + bodyElt.scrollTop,
    left: rect.left + bodyElt.scrollLeft,
  };
};

const addCommentButtons = document.getElementsByClassName("add_comment");
Array.from(addCommentButtons).forEach((button) => {
  button.addEventListener("click", (e) => {
    let comment_text = document.getElementById("comment_text").value;
    
    baseId++;
    let commentId = baseId;

    let existingComment = comment_storage.find(comment => comment.containerId === "comment" + commentId);

    if (existingComment) {
      existingComment.text = comment_text;
    } else {
      comment_storage.push({
        id: commentId,
        containerId: "comment" + commentId,
        historyId: "historyDiv" + baseId,
        x: comment_x,
        y: comment_y,
        baseX: comment_x,
        baseY: comment_y,
        width: 30 * 0.75 * 0.8,
        height: 30 * 0.75 * 0.8,
        text: comment_text,
        page_number: PDFViewerApplication.page
      });
    }

    const date = new Date(Date.now());
    addHistory(baseId, COMMENT, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "comment", "comment");

    let pageId = String(PDFViewerApplication.page);
    let pg = document.getElementById(pageId);

    const commentContainer = document.createElement("div");
    commentContainer.id = "commentContainer" + commentId;
    commentContainer.style.position = "absolute";
    commentContainer.style.zIndex = 120;
    commentContainer.style.top = (mouse_y - 9) + "px";
    commentContainer.style.left = (mouse_x - 9) + "px";

    const stickyNoteImage = document.createElement("img");
    stickyNoteImage.src = "./images/comment-svgrepo-com.svg";
    stickyNoteImage.classList.add("comment-icon");

    stickyNoteImage.addEventListener("dblclick", () => {
      if (commentControlPanel.style.display === "none") {
        commentControlPanel.style.display = "block";
      } else {
        commentControlPanel.style.display = "none";
      }
    });

    // Comment control panel
    const commentControlPanel = document.createElement("div");
    commentControlPanel.classList.add("comment-control-panel");
    commentControlPanel.style.position = "relative";
    commentControlPanel.style.display = "none";
    commentControlPanel.id = `comment_panel_${commentId}`;

    const commentHeader = document.createElement("div");
    commentHeader.classList.add("comment-control-header");
    
    const title = document.createElement("strong");
    title.innerText = "Note";

    const closeButton = document.createElement("span");
    closeButton.classList.add("comment-close");

    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa", "fa-close");

    closeButton.appendChild(closeIcon);

    closeButton.addEventListener("click", () => {
      commentControlPanel.style.display = "none";
    });

    commentHeader.appendChild(title);
    commentHeader.appendChild(closeButton);

    const commentContent = document.createElement("div");
    commentContent.classList.add("comment-control-content");

    const commentTextArea = document.createElement("textarea");
    commentTextArea.id = `comment_text_${commentId}`;
    commentTextArea.classList.add("comment-textarea");
    commentTextArea.rows = 4;
    commentTextArea.placeholder = "Contents...";
    commentTextArea.value = comment_text;

    const commentInput = document.createElement("input");
    commentInput.id = `comment_reply_${commentId}`;
    commentInput.classList.add("comment-input", "hidden", "w-100");
    commentInput.placeholder = "Add reply...";

    commentContent.appendChild(commentTextArea);
    commentContent.appendChild(commentInput);

    const postButton = document.createElement("button");
    postButton.type = "button";
    postButton.classList.add("btn", "btn-info", "add_comment");
    postButton.id = `add_${commentId}`;
    postButton.innerText = "Post";

    postButton.addEventListener("click", () => {
      const updatedText = document.getElementById(`comment_text_${commentId}`).value;
      if (updatedText) {
        const existingComment = comment_storage.find(comment => comment.containerId === "comment" + commentId);
        if (existingComment) {
          existingComment.text = updatedText;
        }
        commentControlPanel.style.display = "none";
      }
    });

    let currentObject;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn", "btn-danger", "delete_comment");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", () => {
      currentObject = comment_storage.find((comment) => comment.containerId == "comment" + commentId);
      comment_storage = comment_storage.filter(comment => comment.containerId !== "comment" + commentId);
      comment_storage = comment_storage.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      
      stickyNoteImage.remove();
      commentControlPanel.remove();

      if (currentObject) {
        const commentPageDiv = document.getElementById(`page${currentObject.page_number}`);
        const currentHistoryDiv = document.getElementById(currentObject.historyId);
        if (commentPageDiv && commentPageDiv.contains(currentHistoryDiv)) {
          commentPageDiv.removeChild(currentHistoryDiv);
        }
      }
    });

    commentControlPanel.appendChild(commentHeader);
    commentControlPanel.appendChild(commentContent);
    commentControlPanel.appendChild(postButton);
    commentControlPanel.appendChild(deleteButton);

    commentContainer.appendChild(stickyNoteImage);
    commentContainer.appendChild(commentControlPanel);

    // Append the container to the page
    pg.appendChild(commentContainer);

    document.getElementById("comment_text").value = "";
    resizeCanvas(commentContainer.id, COMMENT, commentId);
    isAddCommentModeOn = false;
    handleChange();
  })
});


const moveEventHandler = (event, offsetX, offsetY, currentId) => {
  if (DrawType === COMMENT) {
    if(comment_storage){
      comment_storage.map(function (comment) {
        if (comment.id === parseInt(currentId)) {
          comment.x = comment.baseX + offsetX * 0.75;
          comment.y = comment.baseY - offsetY * 0.75;
        }
      });
    }
  }
  if (offsetX != 0 || offsetY != 0) {
    if (DrawType === RADIO) {
      if(form_storage){      
        form_storage.map(function (item) {
          if (item.id === parseInt(currentId)) {
            item.data.x = item.data.baseX + offsetX * 0.75;
            item.data.y = item.data.baseY - offsetY * 0.75;
          }
        });
      }
    } else if (DrawType === TEXT_CONTENT) {
      if(text_storage){
        text_storage.map(function (item) {
          if (item.id === parseInt(currentId)) {
            item.x = item.baseX + offsetX * 0.75;
            item.y = item.baseY - offsetY * 0.75;
          }
        });
      }
    } else {
      if(form_storage){
        form_storage.map(function (item) {
          if (item.id === parseInt(currentId)) {
            item.x = item.baseX + offsetX * 0.75;
            item.y = item.baseY - offsetY * 0.75;
          }
        });
      }
    }
  }
};

viewer.addEventListener("click", (evt) => {
  if (pageWidth == 0) getPageWidth();
  let ost = computePageOffset();

  comment_x = evt.pageX - ost.left;
  comment_y = evt.pageY - ost.top;
  mouse_x = comment_x;
  mouse_y = comment_y;
  let x_y = PDFViewerApplication.pdfViewer._pages[
    PDFViewerApplication.page - 1
  ].viewport.convertToPdfPoint(comment_x, comment_y);
  comment_x = x_y[0];
  comment_y = x_y[1];

  if (isAddCommentModeOn) {
    comment_control.style.left = evt.x + "px";
    comment_control.style.top = evt.y + "px";
    comment_control.style.display = "block";
  }
  if (isTextModeOn) {
    isTextModeOn = !isTextModeOn;
    let pageId = String(PDFViewerApplication.page);
    let pg = document.getElementById(pageId);
    pos_x_pdf = x_y[0];
    pos_y_pdf = x_y[1];

    baseId++;
    let textContentId = baseId;

    const newText = document.createElement("div");
    newText.id = "textcontent" + textContentId;
    newText.contentEditable = "true";
    newText.spellcheck = "false";
    newText.textContent = "";
    newText.style.position = "relative";
    newText.classList.add("textcontent");
    newText.oninput = function () {
      current_text_num_id = textContentId;
      saveTextContent();
    }
    newText.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.execCommand('insertLineBreak');
      }
    });

    const container = document.createElement("div");
    container.id = "text-content" + textContentId;
    container.className = "text-content";
    container.style.position = "absolute";
    container.style.top = mouse_y + "px";
    container.style.left = mouse_x + "px";
    container.style.width = "fit-content";
    container.style.height = "fit-content";
    // container.style.zIndex = 1;
    // container.style.zIndex = selectedZIndex;
    container.tabIndex = 0;
    container.classList.add("textfield-content");
    container.append(newText);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        container.style.width = "fit-content";
        container.style.height = "fit-content";
        textContentSize.x = width;
        textContentSize.y = height;
        saveTextContent();
      }
    });

    observer.observe(newText);

    pg.append(container);

    newText.focus();
    current_text_content_id = newText.id;
    current_text_container_id = container.id;
    current_text_num_id = textContentId;

    if (!textFieldFontColorPickerInitialized) {
      const textColorElement = document.getElementById("text-field-font-colorpicker");
      if (textColorElement) {
        new GridColorPicker(textColorElement, {
          defaultColor: "#000000",
          callback: (selectedColor) => {
            newText.style.color = selectedColor;  // Apply selected text color
          },
        });
        textFieldFontColorPickerInitialized = true;
      }
    }

    showOptionAndResizebar(
      TEXT_CONTENT_OPTION,
      container,
      textContentSize.x,
      15,
      "text-content"
    );

    newText.style.fontFamily = $("#text-content-font-style").val();
    newText.style.fontSize = $("#text-content-font-size").val() + "px";
    newText.style.color = $("#text-field-font-colorpicker").val();

    $("#text-bold").click(function(){
      handleBold();
    })

    $("#text-italic").click(function(){
      handleItalic();
    })

    $("#text-underline").click(function(){
      handleUnderline();
    })

    $(document).on('change', '#text-content-font-style', function() {
      $('#' + current_text_content_id).css('font-family', $(this).val());
      adjustZIndex($(this));
    })

    $(document).on('change', '#text-content-font-size', function() {
      $('#' + current_text_content_id).css('font-size', $(this).val() + 'px');
      adjustZIndex($(this));
    })

    $(document).on('change', '#text-field-font-colorpicker', function() {
      $('#' + current_text_content_id).css('color', $(this).val());
      adjustZIndex($(this));
    })

    $(document).on('focus', '#text-content-font-style', function() {
      adjustZIndex($(this));
    })

    $(document).on('focus', '#text-content-font-size', function() {
      adjustZIndex($(this));
    })

    $(document).on('focus', '#text-content-color', function() {
      adjustZIndex($(this));
    })

    $(document).on('dblclick', '.textcontent', function() {
      var textType = $(this).attr("type");
      if(textType !== "date"){
        const $this = $(this);
        const text = $this.text();
        const classes = $(this).attr('class').replace('textcontent', '').trim();
        const $input = $('<input>', {
          type: 'text',
          value: text,
          class: 'inputcontent ' + classes,
          css: {
            width: 'auto',
            height: 'fit-content',
            fontFamily: $this.css('font-family'),
            fontSize: $this.css('font-size'),
            color: $this.css('color'),
            outline: '2px dashed #3c97fe',
            border: 'none',
            cursor: 'move'
          }
        });
      
        $this.parent().addClass("dblclicked");
      
        $input.on('blur', function() {
          const newText = $input.val();
          $this.text(newText).css('display', 'block');
          $input.replaceWith($this);
          $this.parent().removeClass("dblclicked");
        });
      
        $this.replaceWith($input);
  
        // Focus on the last character
        const inputLength = $input.val().length;
        $input.focus().get(0).setSelectionRange(inputLength, inputLength); 

        $(document).on("click", "#" + TEXT_CONTENT_OPTION, function(){
          $this.parent().css("z-index", selectedZIndex);
        });
        $(document).on("mousedown", "#" + TEXT_CONTENT_OPTION, function(){
          $this.parent().css("z-index", selectedZIndex);
        });
      }
    });

    const textEventHandler = function () {
      if (!isEditing) {
        current_text_content_id = newText.id;
        current_text_num_id = textContentId;
  
        let istooltipshow = false;
        if (
          document.getElementById("text-content_tooltipbar" + current_text_num_id)
        ) {
          istooltipshow = true;
        }
        if (isDragging) {
          isDragging = false;
        } else {
          if (!istooltipshow) {
            let tooltipbar = document.createElement("div");
  
            addDeleteButton(current_text_num_id, tooltipbar, container, "text-content");
            text_storage.map((element) => {
              if (element.id == textContentId) {
                isOptionPane = true;
                if (element.xPage <= 360) {
                  option = showOption(TEXT_CONTENT_OPTION, 0, 15);
                } else {
                  option = showOption(TEXT_CONTENT_OPTION, element.xPage / 2 - 180, 15);
                }
                (isBold = element.isBold), (isItalic = element.isItalic), (isUnderline = element.isUnderline);
                // addBoldItalicEvent();
                if (isBold)
                  document.getElementById("text-bold").classList.add("active");
                if (isItalic)
                  document.getElementById("text-italic").classList.add("active");
                if (isUnderline)
                  document.getElementById("text-underline").classList.add("active");
                if(document.getElementById("text-content-font-style")){
                  document.getElementById("text-content-font-style").value = element.regularFontStyle;
                }
                if(document.getElementById("text-content-font-size")){
                  document.getElementById("text-content-font-size").value = element.fontSize;
                }
                if(document.getElementById("text-content-color")){
                  document.getElementById("text-content-color").value = element.textColor;
                }

                $(document).on("click", "#" + TEXT_CONTENT_OPTION, function(){
                  document.getElementById(container.id).style.zIndex = selectedZIndex;
                });
                $(document).on("mousedown", "#" + TEXT_CONTENT_OPTION, function(){
                  document.getElementById(container.id).style.zIndex = selectedZIndex;
                });

                container.append(option);
              }
            });

            if(document.getElementById("text-content-save-button")){
              document
              .getElementById("text-content-save-button")
              .addEventListener("click", handleTextContent);
            }
          } else {
            document.getElementById("text-content_tooltipbar" + current_text_num_id).remove();
          }
        }
      }
    }

    container.addEventListener("dblclick", textEventHandler);
    resizeCanvas(
      container.id,
      TEXT_CONTENT,
      current_text_num_id,
      TEXT_CONTENT_OPTION
    );

    isTextModeOn = false;
    handleChange();
    handleTextContent();

    if(document.getElementById("text-content-save-button")){
      document
      .getElementById("text-content-save-button")
      .addEventListener("click", handleTextContent);
    }
  }
});

function adjustZIndex(that){
  $(".textfield-content").css('z-index', 150);
  $(that).parents(".textfield-content").css("z-index", 150);
}

function add_txt_comment() {
  pdfFactory = new pdfAnnotate.AnnotationFactory(pdfBytes);
  if (comment_storage.length != 0) {
    comment_storage.forEach((comment_item) => {
      pdfFactory.createTextAnnotation(
        PDFViewerApplication.page - 1,
        [
          comment_item.x,
          comment_item.y - comment_item.height,
          comment_item.x + comment_item.width,
          comment_item.y,
        ],
        comment_item.text
      );
    });
  }
  pdfFactory.download();
}

// Function to split the text into lines based on the maximum width
function splitTextIntoLines(text, maxWidth, font, fontSize) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const width = font.widthOfTextAtSize(word, fontSize);
    if (font.widthOfTextAtSize(currentLine + " " + word, fontSize) < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine.trim());
      currentLine = word;
    }
  });

  lines.push(currentLine.trim());

  return lines;
}

const setDocumentAsPDF = async function () {
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  pdfBytes = await pdfDoc.save();
  if (form_storage.length != 0 || text_storage.length != 0 || comment_storage.length != 0)
    addFormElements().then(() => {
      add_txt_comment();
    });
  else {
    add_txt_comment();
  }
};
