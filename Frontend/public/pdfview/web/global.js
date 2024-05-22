const openToolbar = () => {
    document.getElementById("scaleSelect").value = "auto";
    PDFViewerApplication.pdfViewer.currentScaleValue = "auto";
    rightSidebarButton.classList.toggle("rotate");
    sidebar.classList.toggle("active");
};

function extractNumbersAsString(str) {
    if (str) return str.match(/\d+/g).join('');
    else return null;
}