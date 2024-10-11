const openToolbar = () => {
    // PDFViewerApplication.pdfViewer.currentScaleValue = "auto";
    sidebar.classList.toggle("active");

    $("#add_comment_mode").removeClass("active_menu");
    $("#comment_control_panel").hide();
};

function extractNumbersAsString(str) {
    if (str) return str.match(/\d+/g).join('');
    else return null;
}