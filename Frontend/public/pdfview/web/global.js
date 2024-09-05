const openToolbar = () => {
    document.getElementById("scaleSelect").value = 1;
    // PDFViewerApplication.pdfViewer.currentScaleValue = "auto";
    rightSidebarButton.classList.toggle("rotate");
    sidebar.classList.toggle("active");

    $("#add_comment_mode").removeClass("active_menu");
    $("#comment_control_panel").hide();
};

function extractNumbersAsString(str) {
    if (str) return str.match(/\d+/g).join('');
    else return null;
}