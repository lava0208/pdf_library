const shareDocumentContainer = document.getElementById("share-document-container");
const shareDocumentClose = document.getElementById("share-document-close");
const shareDocumentSenderName = document.getElementById("share-document-sender-name");
const shareDocumentSenderEmail = document.getElementById("share-document-sender-email");
const shareDocumentSenderDescription = document.getElementById("share-document-sender-description");
const shareDocumentSenderEmailChecker = document.getElementById("share-document-sender-email-check");
const shareDocumentSendButton = document.getElementById("share-document-send");

shareDocumentClose.onclick = function () {
  shareDocumentContainer.style.display = "none";
}
shareDocumentSenderEmail.oninput = function () {
  shareDocumentSenderEmailChecker.style.display = "block";
  const email = shareDocumentSenderEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    shareDocumentSenderEmailChecker.textContent = "Valid email format";
    shareDocumentSenderEmailChecker.style.color = "green";
    // You can perform further actions for a valid email format here
  } else {
    shareDocumentSenderEmailChecker.textContent = "Invalid email format";
    shareDocumentSenderEmailChecker.style.color = "red";
    // You can provide feedback to the user for an invalid email format here
  }
}

shareDocumentSendButton.onclick = async function () {
  shareDocumentContainer.style.display = "none";
  let descriptionData = '';

  pdfBytes = await PDFViewerApplication.pdfDocument.saveDocument();

  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('pdfFile', pdfBlob, "uploaded.pdf");
  formData.append('pdfFormData', JSON.stringify(form_storage));
  formData.append("name", shareDocumentSenderName.value);
  // formData.append("email", shareDocumentSenderEmail.value);
  if (shareDocumentSenderDescription.value) descriptionData = shareDocumentSenderDescription.value;
  formData.append('pdfTextData', JSON.stringify(text_storage));
  formData.append("description", descriptionData);

  // Get an array of selected email addresses
  const selectedEmails = $('#email-input').val();

  if (!selectedEmails || selectedEmails.length === 0) {
    console.error('No recipient email addresses provided');
    return;
  }

  // Append the selected email addresses to the form data
  formData.append('emails', selectedEmails);

  fetch(`${BASE_URL}/sendlink`, {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        alert("Successfully Sent!")
      } else {
        console.error('Failed to upload PDF file');
      }
    })
    .catch(error => console.error('Error:', error));

}

const shareLink = function () {
  shareDocumentContainer.style.display = "flex";
};
