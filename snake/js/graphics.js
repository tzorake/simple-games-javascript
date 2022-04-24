const Graphics = {};

Graphics.canvas = null;
Graphics.context = null;
Graphics.setCanvas = setCanvas;
Graphics.getCanvas = getCanvas;
Graphics.setContext = setContext;
Graphics.getContext = getContext;
Graphics.rect = rect;
Graphics.circle = circle;
Graphics.background = background;

function setCanvas(canvas) {
    const parent = canvas.parentElement;

    Graphics.canvas = canvas;
    Graphics.canvas.width = parent.clientWidth;
    Graphics.canvas.height = parent.clientHeight;
}

function getCanvas() {
    return Graphics.canvas;
}

function setContext(context) {
    Graphics.context = context;
}

function getContext() {
    return Graphics.context;
}

function rect(x0, y0, x1, y1, color) {
    const context = getContext();

    const path = new Path2D();
    path.moveTo(x0, y0);
    path.lineTo(x1, y0);
    path.lineTo(x1, y1);
    path.lineTo(x0, y1);
    path.lineTo(x0, y0);

    context.fillStyle = color;
    context.fill(path);
    // context.strokeStyle = 'red';
    // context.stroke(path);
}

function circle(x, y, r, color) {
    const context = getContext();

    const path = new Path2D();
    path.arc(x, y, r, 0, 2*Math.PI);

    context.fillStyle = color;
    context.fill(path);
}

function background(color) {
    const canvas = Graphics.getCanvas();

    Graphics.rect(0, 0, canvas.width, canvas.height, color)
}