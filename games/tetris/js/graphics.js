export { Graphics };

class Graphics {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.canvas.width = canvas.clientWidth;
        this.canvas.height = canvas.clientHeight;
    }

    getCanvas() {
        return this.canvas;
    }
    
    getContext() {
        return this.context;
    }
    
    pop() {
        const context = this.getContext();
    
        context.restore();
    }
    
    push() {
        const context = this.getContext();
    
        context.save();
    }
    
    translate(x, y) {
        const context = this.getContext();
    
        context.translate(x, y);
    }
    
    rect(x0, y0, x1, y1, fill, stroke) {
        const context = this.getContext();
    
        const path = new Path2D();
        path.moveTo(x0, y0);
        path.lineTo(x1, y0);
        path.lineTo(x1, y1);
        path.lineTo(x0, y1);
        path.lineTo(x0, y0);
    
        context.fillStyle = fill;
        context.fill(path);
        context.strokeStyle = stroke;
        context.stroke(path);
    }
    
    circle(x, y, r, color) {
        const context = this.getContext();
    
        const path = new Path2D();
        path.arc(x, y, r, 0, 2*Math.PI);
    
        context.fillStyle = color;
        context.fill(path);
    }
    
    image(img, x, y, w, h) {
        const context = this.getContext();
        context.drawImage(img, x, y, w, h);
    }
    
    background(color) {
        const canvas = this.getCanvas();
        this.rect(0, 0, canvas.width, canvas.height, color);
    }
}
