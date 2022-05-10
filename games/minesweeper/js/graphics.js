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

    line(x0, y0, x1, y1) {

    }

    acuteArcToBezier(start, size) {
        const alpha = size / 2.0,
          cos_alpha = Math.cos(alpha),
          sin_alpha = Math.sin(alpha),
          cot_alpha = 1.0 / Math.tan(alpha),
          phi = start + alpha,
          cos_phi = Math.cos(phi),
          sin_phi = Math.sin(phi),
          lambda = (4.0 - cos_alpha) / 3.0,
          mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;
      
        return {
          ax: Math.cos(start).toFixed(7),
          ay: Math.sin(start).toFixed(7),
          bx: (lambda * cos_phi + mu * sin_phi).toFixed(7),
          by: (lambda * sin_phi - mu * cos_phi).toFixed(7),
          cx: (lambda * cos_phi - mu * sin_phi).toFixed(7),
          cy: (lambda * sin_phi + mu * cos_phi).toFixed(7),
          dx: Math.cos(start + size).toFixed(7),
          dy: Math.sin(start + size).toFixed(7)
        }
    }

    arc(x, y, w, h, start, stop, fill, stroke) {
        const context = this.context;
        const rx = w / 2.0;
        const ry = h / 2.0;
        const epsilon = 0.00001;
        let arcToDraw = 0;
        const curves = [];

        let fillColor = fill;
        let strokeColor = stroke;

        x += rx;
        y += ry;
      
        while (stop - start >= epsilon) {
          arcToDraw = Math.min(stop - start, Math.PI/2);
          curves.push(this.acuteArcToBezier(start, arcToDraw));
          start += arcToDraw;
        }
      
        if (fillColor) {
            context.beginPath();
            curves.forEach((curve, index) => {
                if (index === 0) {
                    context.moveTo(x + curve.ax * rx, y + curve.ay * ry);
                }
                context.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
                                x + curve.cx * rx, y + curve.cy * ry,
                                x + curve.dx * rx, y + curve.dy * ry);
            });
            context.lineTo(x, y);
            context.closePath();
            context.fillStyle = fillColor;
            context.fill();
        }

        if (stroke) {
            context.beginPath();
            curves.forEach((curve, index) => {
                if (index === 0) {
                    context.moveTo(x + curve.ax * rx, y + curve.ay * ry);
                }
                context.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
                                x + curve.cx * rx, y + curve.cy * ry,
                                x + curve.dx * rx, y + curve.dy * ry);
            });
            context.lineTo(x, y);
            context.closePath();
            context.strokeStyle = strokeColor;
            context.stroke();
        }
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
