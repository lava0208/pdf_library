let comment_control = document.getElementById("comment_control_panel");

let comment_x = 0, comment_y = 0;

let pdfBytes;

let isAddCommentModeOn = false;
let isTextModeOn = false;

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
  let fontName = document.getElementById(id).value;
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
      boldBtn.classList.remove("text-weight-button-focused");
    }
    document.getElementById(current_text_content_id).classList.remove("bold-text");
    isBold = false;
  } else {
    if (boldBtn) {
      boldBtn.classList.add("text-weight-button-focused");
    }
    document.getElementById(current_text_content_id).classList.add("bold-text");
    isBold = true;
  }
  saveTextContent();
};
const handleItalic = function () {
  const italicBtn = document.getElementById("text-italic");
  if (isItalic) {
    if (italicBtn) {
      italicBtn.classList.remove("text-weight-button-focused");
    }
    document.getElementById(current_text_content_id).classList.remove("italic-text");
    isItalic = false;
  } else {
    if (italicBtn) {
      italicBtn.classList.add("text-weight-button-focused");
    }
    document.getElementById(current_text_content_id).classList.add("italic-text");
    isItalic = true;
  }
  saveTextContent();
};

const addBoldItalicEvent = function () {
  const boldBtn = document.getElementById("text-bold");
  const italicBtn = document.getElementById("text-italic");
  boldBtn.addEventListener("click", handleBold);
  italicBtn.addEventListener("click", handleItalic);
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
  boldBtn.removeEventListener("click", handleBold);
  italicBtn.removeEventListener("click", handleItalic);
  if (isBold) {
    boldBtn.classList.remove("text-weight-button-focused");
  }
  if (isItalic) {
    italicBtn.classList.remove("text-weight-button-focused");
  }
  (isBold = false), (isItalic = false);
};

const saveTextContent = function () {
  fontStyle = generateFontName("text-content-font-style");
  fontSize = parseInt(document.getElementById("text-content-font-size").value);
  textColor = document.getElementById("text-content-color").value;
  const regularFont = document.getElementById("text-content-font-style").value;
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

  for (let i = 0; i < text_storage.length; i++) {
    if (text_storage[i].id == current_text_num_id) {
      text_storage[i].fontStyle = fontStyle;
      text_storage[i].regularFontStyle = regularFont;
      text_storage[i].fontSize = fontSize * 0.75 * 0.8;
      text_storage[i].textColor = textColor;
      text_storage[i].text = resultArray;
      text_storage[i].isBold = isBold;
      text_storage[i].isItalic = isItalic;
      text_storage[i].width = textContentSize.x * 0.75 * 0.75;
      text_storage[i].height = textContentSize.y * 0.75 * 0.75;
      text_storage[i].xPage = textContentSize.x;
      text_storage[i].yPage = textContentSize.y;
      break;
    }
  }
  let count = 0;
  for (let j = 0; j < text_storage.length; j++) {
    if (text_storage[j].id != current_text_num_id) count++;
  }
  if (baseId !== 0 && (count == text_storage.length || text_storage == null)) {
    text_storage.push({
      id: baseId,
      containerId: "text-content" + baseId,
      textContentId: "textcontent" + baseId,
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
      fontSize: fontSize * 0.75 * 0.8,
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
    addHistory(baseId, TEXT_CONTENT, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "text-content");
  }
}

const handleTextContent = (e) => {
  isOptionPane = false;
  document.getElementById(TEXT_CONTENT_OPTION).style.display = "none";
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

document.getElementById("add_comment").addEventListener("click", (e) => {
  let comment_title = document.getElementById("comment_title").value;
  let comment_text = document.getElementById("comment_text").value;

  baseId++;
  let commentId = baseId;



  comment_storage.push({
    id: commentId,
    containerId: "comment" + commentId,
    x: comment_x,
    y: comment_y,
    baseX: comment_x,
    baseY: comment_y,
    width: 30 * 0.75 * 0.8,
    height: 30 * 0.75 * 0.8,
    title: comment_title,
    text: comment_text,
    page_number: PDFViewerApplication.page
  });

  const date = new Date(Date.now());
  addHistory(baseId, COMMENT, USERNAME, convertStandardDateType(date), PDFViewerApplication.page, "comment");

  let pageId = String(PDFViewerApplication.page);
  let pg = document.getElementById(pageId);

  let comment_icon = document.createElement("div");
  comment_icon.style.height = "30px";
  comment_icon.style.width = "30px";
  comment_icon.id = "comment" + commentId;
  comment_icon.style.position = "absolute";
  comment_icon.style.zIndex = 100;
  comment_icon.style.top = mouse_y + "px";
  comment_icon.style.left = mouse_x + "px";
  comment_icon.style.backgroundSize = "100% 100%";
  comment_icon.style.backgroundImage =
    "url('./images/comment-svgrepo-com.svg')";

  comment_icon.addEventListener("dblclick", (e) => {
    current_comment_id = commentId;
    let istooltipshow = false;
    if (document.getElementById("comment_tooltipbar" + current_comment_id)) {
      istooltipshow = true;
    }

    if (isDragging) {
      isDragging = false;
    } else {
      if (!istooltipshow) {
        let tooltipbar = document.createElement("div");
        addDeleteButton(
          current_comment_id,
          tooltipbar,
          comment_icon,
          "comment"
        );
      } else {
        document
          .getElementById("comment_tooltipbar" + current_comment_id)
          .remove();
      }
    }
  });

  pg.appendChild(comment_icon);

  document.getElementById("comment_title").value = "";
  document.getElementById("comment_text").value = "";
  // document.getElementById("comment_control_panel").style.display = "none";
  // document.getElementById("add_comment_mode").innerHTML =
  //   '<i class="far fa-comment"></i><p class="menu-button-item">Add Comment</p>';
  resizeCanvas(comment_icon.id, COMMENT, commentId);
  isAddCommentModeOn = false;
  handleChange();
});

const moveEventHandler = (event, offsetX, offsetY, currentId) => {
  if (DrawType === COMMENT) {

    comment_storage.map(function (comment) {
      if (comment.id === parseInt(currentId)) {
        comment.x = comment.baseX + offsetX * 0.75 * 0.8;
        comment.y = comment.baseY - offsetY * 0.75 * 0.8;
      }
    });
  }
  if (offsetX != 0 || offsetY != 0) {
    if (DrawType === RADIO) {
      form_storage.map(function (item) {
        if (item.id === parseInt(currentId)) {
          item.data.x = item.data.baseX + offsetX * 0.75 * 0.8;
          item.data.y = item.data.baseY - offsetY * 0.75 * 0.8;
        }
      });
    } else if (DrawType === TEXT_CONTENT) {
      text_storage.map(function (item) {
        if (item.id === parseInt(currentId)) {
          item.x = item.baseX + offsetX * 0.75 * 0.8;
          item.y = item.baseY - offsetY * 0.75 * 0.8;
        }
      });
    } else {
      form_storage.map(function (item) {
        if (item.id === parseInt(currentId)) {
          item.x = item.baseX + offsetX * 0.75 * 0.8;
          item.y = item.baseY - offsetY * 0.75 * 0.8;
        }
      });
    }
  }
};

document.getElementById("viewer").addEventListener("click", (evt) => {
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

  document.querySelectorAll('.textfield-content').forEach(div => {
    div.addEventListener('click', function() {
      this.classList.remove("clicked");
    });
  });

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
    newText.textContent = "Your text is here!";
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
    container.style.position = "absolute";
    container.style.top = mouse_y + "px";
    container.style.left = mouse_x + "px";
    container.style.width = "fit-content";
    container.style.height = "fit-content";
    container.style.zIndex = 101;
    container.tabIndex = 0;
    container.classList.add("textfield-content");
    container.append(newText);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        container.style.width = "fit-content";
        container.style.height = height + "px";
        textContentSize.x = width;
        textContentSize.y = height;
        saveTextContent();
      }
    });

    observer.observe(newText);

    pg.append(container);
    current_text_content_id = newText.id;
    current_text_container_id = container.id;
    current_text_num_id = textContentId;
    showOptionAndResizebar(
      TEXT_CONTENT_OPTION,
      container,
      textContentSize.x,
      15,
      "text-content"
    );

    addBoldItalicEvent();

    newText.style.fontFamily = document.getElementById(
      "text-content-font-style"
    ).value;
    newText.style.fontSize = document.getElementById("text-content-font-size").value + "px";
    newText.style.color = document.getElementById("text-content-color").value;

    document
      .getElementById("text-content-font-style")
      .addEventListener("change", () => {
        document.getElementById(current_text_content_id).style.fontFamily =
          document.getElementById("text-content-font-style").value;
      });
    document
      .getElementById("text-content-font-size")
      .addEventListener("change", () => {
        document.getElementById(current_text_content_id).style.fontSize =
          document.getElementById("text-content-font-size").value + "px";
      });
    document
      .getElementById("text-content-color")
      .addEventListener("change", () => {
        document.getElementById(current_text_content_id).style.color =
          document.getElementById("text-content-color").value;
      });

    document.querySelectorAll('.textcontent').forEach(div => {
      div.addEventListener('dblclick', function() {
        const text = this.innerText;
        const input = document.createElement('input');

        input.type = 'text';
        input.value = text;
        input.className = 'inputcontent';

        input.style.width = '100%';
        input.style.height = this.offsetHeight + 'px';
        input.style.fontFamily = this.style.fontFamily;
        input.style.fontSize = this.style.fontSize;
        input.style.color = this.style.color;

        input.addEventListener('blur', function() {
          div.innerText = this.value;
          div.style.display = 'block';
          input.remove();
        });

        this.style.display = 'none';
        this.parentNode.insertBefore(input, this);
        input.focus();
      });
    });

    document.querySelectorAll('.textfield-content').forEach(div => {
      div.addEventListener('dblclick', function() {
        if (!this.classList.contains("clicked")){
          this.classList.add("clicked");
        }
      });
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
                isOptionPane = true;  //... Show "Add Text" option with double click
                if (element.xPage <= 360) {
                  option = showOption(TEXT_CONTENT_OPTION, 0, 15);
                } else {
                  option = showOption(TEXT_CONTENT_OPTION, element.xPage / 2 - 180, 15);
                }
                (isBold = element.isBold), (isItalic = element.isItalic);
                addBoldItalicEvent();
                if (isBold)
                  document.getElementById("text-bold").classList.add("text-weight-button-focused");
                if (isItalic)
                  document.getElementById("text-italic").classList.add("text-weight-button-focused");
                document.getElementById("text-content-font-style").value = element.regularFontStyle;
                document.getElementById("text-content-font-size").value = element.baseFontSize;
                document.getElementById("text-content-color").value = element.textColor;
                container.append(option);
              }
            });
            document
              .getElementById("text-content-save-button")
              .addEventListener("click", handleTextContent);
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

    document
      .getElementById("text-content-save-button")
      .addEventListener("click", handleTextContent);
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

const handleChange = () => {
  let addText = document.getElementById("add_text");
  let addComment = document.getElementById("add_comment_mode");
  // Handle TextMode
  if (!isTextModeOn) {
    addText.classList.remove("active_menu");
  } else {
    addText.classList.add("active_menu");
  }
  //Handle AddCommentMode
  if (!isAddCommentModeOn) {
    addComment.classList.remove("active_menu");
    comment_control.style.display = "none";
  } else {
    addComment.classList.add("active_menu");
  }
};

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
        comment_item.title,
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

const setDocument = async function () {
  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  pdfBytes = await pdfDoc.save();
  if (form_storage.length != 0 || text_storage.length != 0)
    addFormElements().then(() => {
      add_txt_comment();
    });
  else {
    add_txt_comment();
  }
};

// OpenFile, SaveFile, PrintButton, ExitButton
let menuBtnStatus = false;
const mainmenu = document.getElementById("main-menu");
document.getElementById("main-menu").addEventListener("click", function () {
  if (menuBtnStatus) {
    mainmenu.style.display = "none";
    menuBtnStatus = !menuBtnStatus;
    document.getElementById("menubtn").classList.remove("active_menu");
  }
});
document.getElementById("menubtn").addEventListener("click", function (event) {
  if (!menuBtnStatus) {
    mainmenu.style.display = "block";
    mainmenu.focus();
    document.getElementById("menubtn").classList.add("active_menu");
  } else {
    mainmenu.style.display = "none";
    document.getElementById("menubtn").classList.remove("active_menu");
  }
  menuBtnStatus = !menuBtnStatus;
});
mainmenu.addEventListener("blur", function (event) {
  const buttonElements = mainmenu.querySelectorAll("button");
  if (
    !event.relatedTarget ||
    ![...buttonElements].includes(event.relatedTarget)
  ) {
    if (menuBtnStatus) {
      mainmenu.style.display = "none";
      document.getElementById("menubtn").classList.remove("active_menu");
    }
  }
});
