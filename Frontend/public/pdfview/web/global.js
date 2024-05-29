const openToolbar = () => {
    document.getElementById("scaleSelect").value = "auto";
    // PDFViewerApplication.pdfViewer.currentScaleValue = "auto";
    rightSidebarButton.classList.toggle("rotate");
    sidebar.classList.toggle("active");

    $("#add_comment_mode").removeClass("active_menu");
    $("#comment_control_panel").hide();
    if($("#editorFreeText").hasClass("toggled")){
        $("#editorFreeText").trigger("click");
    }
};

function extractNumbersAsString(str) {
    if (str) return str.match(/\d+/g).join('');
    else return null;
}