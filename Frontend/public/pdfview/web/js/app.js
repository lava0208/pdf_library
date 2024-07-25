class PlotApp {
  constructor() {
    this.mount();
    this.setup();
    this.hookEventListeners();
  }

  // mount elements
  mount() {
    /***********
     * actions
     ***********/
    // clear canvas
    this.clearCanvas = document.querySelector("#clear-canvas");
    // thickness slider
    this.brushWidthSlider = document.querySelector("#brush-width-slider");
    // color picker
    this.colorPicker = document.querySelector("#color-picker");

    /***********
     * tools
     ***********/
    this.toolBtns = document.querySelectorAll(".drawing-tool");
    this.fillColor = false;
    this.colorBtns = document.querySelectorAll(".drawing-color");

    this.dropdownContainers = [
      '#shape-fill-dropdown',
      '#shape-outline-dropdown',
      '#text-color-dropdown',
      '#border-radius-dropdown'
    ];

    /***********
     * art-board
     ***********/
    // this.canvas = document.getElementById("drawing-board").querySelector('canvas');
    this.canvas = document.getElementById("drawing-shape-board").querySelector('canvas');
    this.storeRect = [];
    this.storeCircle = [];
  }

  setup() {
    this.prevMouseX;
    this.prevMouseY;
    this.snapshot;
    this.isDrawing = false;
    this.selectedTool = "pencil";
    this.brushWidth = this.brushWidthSlider.value;
    this.selectedColor = "#000";

    this.resizeCanvas();

    // canvas context options
    const ctxOptions = {
      willReadFrequently: true,
    };

    // canvas context
    this.ctx = this.canvas.getContext("2d", ctxOptions);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  hookEventListeners() {
    // clear canvas
    this.clearCanvas.addEventListener("click", () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.initStore();
    });
    // tools
    this.toolBtns.forEach((btn) => {
      if (!btn.hasEventListener) {
        btn.hasEventListener = true;
        btn.addEventListener("click", () => {
          if (btn.id === "pencil") {
            // disable brush width slider
            this.brushWidthSlider.disabled = true;
          } else {
            // enable brush width slider
            this.brushWidthSlider.disabled = false;
          }
          //adding click event to all tool option
          // removing active class from the pervious option and adding on current clicked option
          document.querySelector(".drawing-tool.active").classList.remove("active");
          btn.classList.add("active");
          this.selectedTool = btn.id;
          this.canvas.id = this.selectedTool;
        });
      }
    });
    // brush thickness
    this.brushWidthSlider.addEventListener("change", () => {
      if (this.selectedTool === "pencil") {
        this.brushWidth = 2;
        return;
      }

      this.brushWidth = this.brushWidthSlider.value;
      return;
    });
    // colors
    // this.colorBtns.forEach((btn) => {
    //   btn.addEventListener("click", () => {
    //     // adding click event to all color button
    //     // removing active class from the previous option and adding on current clicked option
    //     document.querySelector(".drawing-color.selected").classList.remove("selected");
    //     btn.classList.add("selected");
    //     // passing selected btn background as selectedColor value
    //     this.selectedColor = window
    //       .getComputedStyle(btn)
    //       .getPropertyValue("background-color");
    //   });
    // });

    this.dropdownContainers.forEach(container => {
      const dropdownMenu = document.querySelector(`${container} .dropdown-menu`);

      dropdownMenu.querySelectorAll('.drawing-color').forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedBtn = dropdownMenu.querySelector('.drawing-color.selected');
          if (selectedBtn) {
            selectedBtn.classList.remove('selected');
          }
          btn.classList.add('selected');
          const selectedColor = window
            .getComputedStyle(btn)
            .getPropertyValue("background-color");
  
          console.log('Selected color:', selectedColor);
        });
      });
    });
    

    // color picker
    if (!this.colorPicker.hasEventListener) {
      this.colorPicker.hasEventListener = true;
      this.colorPicker.addEventListener("change", () => {
        console.log("change");
        // add new color box
        const customColor = document.createElement("div");
        customColor.classList.add("drawing-color");
        customColor.style.background = this.colorPicker.value;
        document.querySelector("#colors").appendChild(customColor);
        this.selectedColor = this.colorPicker.value;
        this.colorBtns = document.querySelectorAll(".drawing-color");
        this.hookEventListeners();
      });
    }
    // canvas event listeners
    this.canvas.addEventListener("mousedown", (e) => this.startDraw(e));
    this.canvas.addEventListener("mousemove", (e) => this.drawing(e));
    this.canvas.addEventListener("mouseup", (e) => {
      console.log(e);
      this.isDrawing = false;
      switch (this.selectedTool) {
        case "rectangle":
          this.storeRect.push({
            x: Math.min(this.prevMouseX, e.offsetX),
            y: Math.min(this.prevMouseY, e.offsetY),
            width: Math.abs(e.offsetX - this.prevMouseX),
            height: Math.abs(e.offsetY - this.prevMouseY),
          });
          break;
        case "circle":
          this.storeCircle.push({
            x: this.prevMouseX,
            y: this.prevMouseY,
            radius: Math.sqrt(
              Math.pow(this.prevMouseX - e.offsetX, 2) +
                Math.pow(this.prevMouseY - e.offsetY, 2)
            ),
          });
          break;
      }
    });
    this.canvas.addEventListener("click", (event) => {
      if (this.selectedTool === "bucket") {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        // Check if the click is inside any shape
        this.storeRect.forEach((shape) => {
          if (
            mouseX >= shape.x &&
            mouseX <= shape.x + shape.width &&
            mouseY >= shape.y &&
            mouseY <= shape.y + shape.height
          ) {
            this.ctx.fillStyle = this.selectedColor;
            this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          }
        });
        this.storeCircle.forEach((shape) => {
          const distance = Math.sqrt(
            (event.offsetX - shape.x) ** 2 + (event.offsetY - shape.y) ** 2
          );
          if (distance <= shape.radius) {
            this.ctx.beginPath();
            this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.selectedColor;
            this.ctx.fill();
          }
        });
      }
    });
  }

  resizeCanvas() {
    // grab updated canvas node
    // this.canvas = document.getElementById('drawing-board').querySelector("canvas");
    // const parent = this.canvas.parentNode;
    // const styles = getComputedStyle(parent);
    // const parentWidth = parseInt(styles.getPropertyValue("width"), 10);
    // const parentHeight = parseInt(styles.getPropertyValue("height"), 10);

    // this.canvas.width = parentWidth;
    // this.canvas.height = parentHeight;
  }

  initStore() {
    this.storeCircle = [];
    this.storeRect = [];
  }

  drawing(e) {
    // if isDrawing is flase return form here
    if (!this.isDrawing) return;
    // add the copied canvas on to this canvas
    this.ctx.putImageData(this.snapshot, 0, 0);
    switch (this.selectedTool) {
      case "pencil":
        // pencil is thin
        this.ctx.lineWidth = 2;
        //creating line according to the mouse pointer
        this.ctx.lineTo(e.offsetX, e.offsetY);
        //drawin/filling line with color
        this.ctx.stroke();
        return;
      case "brush":
        //creating line according to the mouse pointer
        this.ctx.lineTo(e.offsetX, e.offsetY);
        //drawin/filling line with color
        this.ctx.stroke();
        return;
      case "eraser":
        this.ctx.strokeStyle = "#fff";
        //creating line according to the mouse pointer
        this.ctx.lineTo(e.offsetX, e.offsetY);
        //drawin/filling line with color
        this.ctx.stroke();
        return;
      case "rectangle":
        this.drawRect(e);
        return;
      case "circle":
        this.drawCircle(e);
        return;
      case "straight":
        this.drawLine(e);
        return;
    }
  }

  drawRect(e) {
    // if fill color is not checked then draw a rect with border else draw rect with background
    if (!this.fillColor.checked) {
      // creating a rectangle according to the mouse pointer
      return this.ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        this.prevMouseX - e.offsetX,
        this.prevMouseY - e.offsetY
      );
    }
    this.ctx.fillRect(
      e.offsetX,
      e.offsetY,
      this.prevMouseX - e.offsetX,
      this.prevMouseY - e.offsetY
    );
  }

  drawLine(e) {
    // create a new path to draw line
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevMouseX, this.prevMouseY);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
  }

  drawCircle(e) {
    // create a new path to draw circle
    this.ctx.beginPath();
    // get radius for circle according to the mouse pointer
    let radius = Math.sqrt(
      Math.pow(this.prevMouseX - e.offsetX, 2) +
        Math.pow(this.prevMouseY - e.offsetY, 2)
    );
    // create circle according to the mouse pointer
    this.ctx.arc(this.prevMouseX, this.prevMouseY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    // if fillColor is checked fill circle else draw border circle
    this.fillColor.checked ? this.ctx.fill() : this.ctx.stroke();
  }

  startDraw(e) {
    this.isDrawing = true;
    this.prevMouseX = e.offsetX; //passing current MouseX position as prevMouseX value
    this.prevMouseY = e.offsetY; //passing current MouseY position as prevMouseY value
    this.ctx.beginPath(); //creating new path to draw
    this.ctx.lineWidth = this.brushWidth; //passing brushSize as line width
    this.snapshot = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ); //coping canvas data and passing as snapshot value.. this avoids dragging the image
    this.ctx.strokeStyle = this.selectedColor; // passing selectedColor as stroke syle
    this.ctx.fillStyle = this.selectedColor; // passing selectedColor as fill style
  }
}
