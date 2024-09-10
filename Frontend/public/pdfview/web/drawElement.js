
let isDrawElement = false;

$(".add_image").on("click", function () {
    baseId++;
    isDrawElement = true;
    viewer.style.cursor = 'crosshair';
});

viewer.addEventListener("mousedown", function (e) {
    if (!isDrawElement) return;  
    
    const rect = viewer.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    
    isDrawing = true;
    viewer.style.cursor = 'auto';
  
    rectElement = document.createElement("div");
    rectElement.id = "shape" + baseId;
    rectElement.className = "shapeContainer form-fields active";
    rectElement.style.display = "flex";
    rectElement.style.alignItems = "center";
    rectElement.style.justifyContent = "center";
    rectElement.style.position = "absolute";
    rectElement.style.left = `${startX}px`;
    rectElement.style.top = `${startY}px`;
    rectElement.style.border = `1px solid blue`;

    console.log(e);
    
  
    viewer.appendChild(rectElement);
});

viewer.addEventListener("mousemove", function (e) {
    if (!isDrawing) return;
  
    const currentX = e.clientX - viewer.getBoundingClientRect().left;
    const currentY = e.clientY - viewer.getBoundingClientRect().top;
    const width = currentX - startX;
    const height = currentY - startY;
  
    rectElement.style.width = `${Math.abs(width)}px`;
    rectElement.style.height = `${Math.abs(height)}px`;
    rectElement.style.left = `${Math.min(currentX, startX)}px`;
    rectElement.style.top = `${Math.min(currentY, startY)}px`;
});

viewer.addEventListener("mouseup", function (e) {
    if (!isDrawing) return;
  
    viewer.style.cursor = 'auto';
  
    const rect = viewer.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
  
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
  
    let ost = computePageOffset();
    let x = left + rect.left - ost.left;
    let y = top + rect.top - ost.top;
  
    let pageId = String(PDFViewerApplication.page);
    let pg = document.getElementById(pageId);
  
    let shape_x_y = PDFViewerApplication.pdfViewer._pages[
      PDFViewerApplication.page - 1
    ].viewport.convertToPdfPoint(x, y);
  
    pos_x_pdf = shape_x_y[0];
    pos_y_pdf = shape_x_y[1];
  
    isDrawing = false;
    isDrawElement = false;
    current_form_id = baseId;
    current_shape_id = baseId;
  
    plot.initStore();
    enableInteractJS(rectElement.id, SHAPE, baseId);
})