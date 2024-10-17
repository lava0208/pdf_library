const wrapper = document.getElementById("signature-pad");
const clearButton = wrapper.querySelector("[data-action=clear]");
const changeColorButton = wrapper.querySelector("[data-action=change-color]");
const drawColorButton = document.getElementById("signature-draw-colorpicker");
const changeWidthButton = wrapper.querySelector("[data-action=change-width]");
const undoButton = wrapper.querySelector("[data-action=undo]");
const savePNGButton = wrapper.querySelector("[data-action=save-png]");
const saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
const saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
const saveSVGWithBackgroundButton = wrapper.querySelector(
  "[data-action=save-svg-with-background]"
);
const canvas = wrapper.querySelector("canvas");
const DRAW = "signature-draw",
  TYPE = "signature-type",
  UPLOAD = "signature-upload";
PROFILE = "signature-profile";
const signatureFonts = ["MrDafoe", "SCRIPTIN", "DrSugiyama"];
const signatureTypeFont = document.getElementById("signature-type-font");
const signatureTypeText = document.getElementById("signature-type-text");
const signatureTypeColor = document.getElementById("signature-type-colorpicker");
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("signature-image-input");
const photoInput = document.getElementById("photo-input");

//...
const profileFileInput = document.getElementById("signature-profile-image-input");
const profileFiles = [];
const signatureProfileColor = document.getElementById("signature-profile-color");

const imagePreview = document.getElementById("image-preview");
const photoPreview = document.getElementById("photo-preview");
const signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: "rgb(255, 255, 255, 0)",
});

let currentSignType = DRAW;

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvasSign() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  const ratio = Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  //signaturePad.clear();

  // If you want to keep the drawing on resize instead of clearing it you can reset the data.
  signaturePad.fromData(signaturePad.toData());
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvasSign;
resizeCanvasSign();

function downloadSign(dataURL, filename) {
  const blob = dataURLToBlob(dataURL);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
function switchSignMethod(event, method) {
  currentSignType = method;
  let i, tabcontents, tablinks;
  tabcontents = document.getElementsByClassName("signature-tab-content");
  for (i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(
      " tablink-active",
      ""
    );
  }
  document.getElementById(`${method}-body`).style.display = "flex";
  document.getElementById(`${method}-footer`).style.display = "flex";
  event.currentTarget.className += " tablink-active";

  console.log(method);
  if(method == "signature-profile"){
    fetchProfileSignatures()
  }
}

function handleSignatureType() {
  let canvas, ctx;
  canvas = document.getElementById("signature-type-canvas");
  ctx = canvas.getContext("2d");
  function drawTextOnCanvas(text, fontFamily, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let fontSize = 40;
    const maxWidth = canvas.width * 0.9;

    do {
      ctx.font = fontSize + "px " + fontFamily;
      var textWidth = ctx.measureText(text).width;
      fontSize -= 1;
    } while (textWidth > maxWidth && fontSize > 10);

    // Set font styles
    ctx.font = "bold " + fontSize + "px " + fontFamily;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let x = canvas.width / 2;
    let y = canvas.height / 2;

    ctx.fillText(text, x, y);
  }

  if (signatureTypeFont) {
    let selectTypeFont = "";
    signatureTypeFont.addEventListener("change", () => {
      drawTextOnCanvas(
        signatureTypeText.value,
        signatureTypeFont.value,
        signatureTypeColor.value
      );
    });
    signatureFonts.map((item) => {
      selectTypeFont += `<option value='${item}' style="height: 50px;font-family: ${item}">${item}</option>`;
    });
    signatureTypeFont.innerHTML = selectTypeFont;
  }

  if (signatureTypeText) {
    signatureTypeText.addEventListener("input", () => {
      drawTextOnCanvas(
        signatureTypeText.value,
        signatureTypeFont.value,
        signatureTypeColor.value
      );
    });
  }

  if (signatureTypeColor) {
    signatureTypeColor.addEventListener("change", () => {
      drawTextOnCanvas(
        signatureTypeText.value,
        signatureTypeFont.value,
        signatureTypeColor.value
      );
    });
  }
}

handleSignatureType();

function handleSignatureImageInput() {
  if (dropArea) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener("drop", handleDrop, false);
  }

  // Handle signature input
  if (fileInput) {
    fileInput.addEventListener("change", function() {
      handleFileUpload("sign");
    }, false);
  }

  // Handle photo input
  if (photoInput) {    
    photoInput.addEventListener("change", function() {
      handleFileUpload("photo");
    }, false);
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    dropArea.classList.add("highlight");
  }

  function unhighlight() {
    dropArea.classList.remove("highlight");
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files[0]);
  }

  function handleFileUpload(type) {
    let selectedFile;
    
    if(type === "sign") {
      selectedFile = fileInput.files[0];
    } else if(type === "photo") {
      selectedFile = photoInput.files[0];
    }

    if (selectedFile) {
      handleFiles(selectedFile, type);
    }
  }

  function handleFiles(file, type) {
    previewImage(file, type);
  }

  function previewImage(file, type) {
    const reader = new FileReader();
    
    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;
      image.style.width = '100%';
      image.style.height = '100%';

      if(type === "sign") {
        imagePreview.innerHTML = "";  // Clear existing preview
        imagePreview.appendChild(image);
      } else if(type === "photo") {
        photoPreview.innerHTML = "";  // Clear existing preview
        photoPreview.appendChild(image);
      }
    };

    reader.readAsDataURL(file);  // Read the file as Data URL
  }
}

//... Upload profile signatures
if (profileFileInput) {
  profileFileInput.addEventListener("change", handleProfileFileUpload, false);
}

function handleProfileFileUpload() {
  const selectedFile = profileFileInput.files[0];
  if (selectedFile) {
    handleProfileFiles(selectedFile);
  }
}

function handleProfileFiles(file) {
  profileFiles.push(file);
  previewProfileImage(file);
}

var profileImgId = 0;

function previewProfileImage(file) {
  profileImgId++;
  const reader = new FileReader();

  reader.onload = function (e) {
    const imgDiv = `<div class="profile-img-list">
      <label for="profile-signature${profileImgId}">
        <img src="${e.target.result}" style="margin-left: 30px" />
        <span>${file.name}</span>
      </label>
      <button onclick="handleProfileSignatureUpload(${profileImgId - 1})">Upload</button>
    </div>`;

    $("#profile-image-preview").append(imgDiv);
  };

  reader.readAsDataURL(file);
}

async function handleProfileSignatureUpload(index) {
  const file = profileFiles[index];
  if (file) {
    const formData = new FormData();
    formData.append('signature', file);
    try {
      const username = localStorage.getItem('username');

      await fetch(`${BASE_URL}/api/users/signature/${username}`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(json => {
          if (json.signature) {
            alert(json.message);
            fetchProfileSignatures()
          } else {
            alert("Failed to upload signature.");
          }
        })
        .catch(error => {
          console.error('Error uploading signature:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

async function fetchProfileSignatures() {
  try {
    const username = localStorage.getItem('username');

    await fetch(`${BASE_URL}/api/users/signature/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        $("#profile-image-preview").empty();
        if(json.signatures.length > 0){
          json.signatures.forEach(function(item, i){
            const imgUrl = `${BASE_URL}/uploads/${item}`;
            const imgDiv = `<div class="profile-img-list">
              <label for="saved-profile-signature${i}" onclick="chooseSignature('${imgUrl}')">
                <input type="checkbox" class="profile-img-checkbox" id="saved-profile-signature${i}" />
                <img src="${imgUrl}" />
                <span>${item}</span>
              </label>
              <button class="btn-info" onclick="chooseSignature('${imgUrl}')">Choose</button>
            </div>`;
        
            $("#profile-image-preview").append(imgDiv);
          })
        }
      })
  } catch (error) {
    console.error("Error fetching signature:", error);
  }
};

function chooseSignature(imgSrc){
  $(".profile-img-list").each(function(){
    $(this).find("input").prop("checked", false);
    $(this).removeClass("active");
  });
  $(event.target).closest(".profile-img-list").find("input").prop("checked", true);
  $(event.target).closest(".profile-img-list").addClass("active");
  selectedProfileSignature = imgSrc;
}

handleSignatureImageInput();

clearButton.addEventListener("click", () => {
  signaturePad.clear();
});

undoButton.addEventListener("click", () => {
  const data = signaturePad.toData();

  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});

drawColorButton.addEventListener("change", () => {
  console.log("----------" + document.getElementById("signature-draw-colorpicker").value);
  
  signaturePad.penColor = document.getElementById("signature-draw-colorpicker").value;
});

changeWidthButton.addEventListener("click", () => {
  const min = Math.round(Math.random() * 100) / 10;
  const max = Math.round(Math.random() * 100) / 10;

  signaturePad.minWidth = Math.min(min, max);
  signaturePad.maxWidth = Math.max(min, max);
});

savePNGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL();
    downloadSign(dataURL, "signature.png");
  }
});

saveJPGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/jpeg");
    downloadSign(dataURL, "signature.jpg");
  }
});

saveSVGButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/svg+xml");
    downloadSign(dataURL, "signature.svg");
  }
});

saveSVGWithBackgroundButton.addEventListener("click", () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
  } else {
    const dataURL = signaturePad.toDataURL("image/svg+xml", {
      includeBackgroundColor: true,
    });
    downloadSign(dataURL, "signature.svg");
  }
});
