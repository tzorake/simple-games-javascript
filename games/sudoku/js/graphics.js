export { Graphics };

class Graphics {
    static EMPTY_STYLE = 'rgba(0, 0, 0, 0)';
    
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
    
    rotate(angle) {
        const context = this.getContext();

        context.rotate(angle);
    }

    text(line, x, y, fill, stroke) {
        const context = this.getContext();
        const doFill = !!fill, doStroke = !!stroke;
        this.push();

        if (doStroke) {
            context.strokeStyle = stroke;
            context.strokeText(line, x, y);
        }

        if (doFill) {
            context.fillStyle = fill;
            context.fillText(line, x, y);
        }

        this.pop();
    };

    font(font, textSize, textStyle) {
        const context = this.getContext();
        context.font = `${textStyle || 'normal'} ${textSize || 12}px ${font || 'sans-serif'}`;
    }
    
    measureText(text) {
        const context = this.getContext();
        return context.measureText(text);
    }

    textAlign(align) {
        const context = this.getContext();
        context.textAlign = align;
    }

    textBaseline(baseline) {
        const context = this.getContext();
        context.textBaseline = baseline;
    }

    line(x1, y1, x2, y2, stroke) {
        const context = this.context;
        const doStroke = !!stroke;
        if (!doStroke) {
            stroke = Graphics.EMPTY_STYLE;
        }
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = stroke;
        context.stroke();
    };


    strokeWeight(w) {
        const context = this.context;
        if (typeof w === 'undefined' || w === 0) {
            context.lineWidth = 0.0001;
        } else {
            context.lineWidth = w;
        }
    };


    rect(x, y, w, h, fill, stroke) {
        let tl = undefined;
        let tr = undefined;
        let br = undefined;
        let bl = undefined;
        const context = this.context;
        const doFill = !!fill, doStroke = !!stroke;

        context.beginPath();

        if (typeof tl === 'undefined') {
            context.rect(x, y, w, h);
        } else {
            if (typeof tr === 'undefined') {
                tr = tl;
            }
            if (typeof br === 'undefined') {
                br = tr;
            }
            if (typeof bl === 'undefined') {
                bl = br;
            }

            const absW = Math.abs(w);
            const absH = Math.abs(h);
            const hw = absW / 2;
            const hh = absH / 2;

            if (absW < 2 * tl) {
                tl = hw;
            }
            if (absH < 2 * tl) {
                tl = hh;
            }
            if (absW < 2 * tr) {
                tr = hw;
            }
            if (absH < 2 * tr) {
                tr = hh;
            }
            if (absW < 2 * br) {
                br = hw;
            }
            if (absH < 2 * br) {
                br = hh;
            }
            if (absW < 2 * bl) {
                bl = hw;
            }
            if (absH < 2 * bl) {
                bl = hh;
            }

            context.beginPath();
            context.moveTo(x + tl, y);
            context.arcTo(x + w, y, x + w, y + h, tr);
            context.arcTo(x + w, y + h, x, y + h, br);
            context.arcTo(x, y + h, x, y, bl);
            context.arcTo(x, y, x + w, y, tl);
            context.closePath();
        }

        if (doFill) {
            context.fillStyle = fill;
            context.fill();
        }
        if (doStroke) {
            context.strokeStyle = stroke;
            context.stroke();
        }
        return this;
    }


    ellipse(x, y, w, h, fill, stroke) {
        const context = this.drawingContext;
        const doFill = !!fill, doStroke = !!stroke;
        if (doFill && !doStroke) {
            if (this._getFill() === styleEmpty) {
                return this;
            }
        } else if (!doFill && doStroke) {
            if (this._getStroke() === styleEmpty) {
                return this;
            }
        }
        const kappa = 0.5522847498,
        ox = w / 2 * kappa,
        oy = h / 2 * kappa,
        xe = x + w,
        ye = y + h,
        xm = x + w / 2,
        ym = y + h / 2; 
        context.beginPath();
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        if (doFill) {
            context.fillStyle = fill;
            context.fill();
        }
        if (doStroke) {
            context.strokeStyle = stroke;
            context.stroke();
        }
    };

    circle(x, y, d, fill, stroke) {
        this.ellipse(x, y, d, d, fill, stroke);
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
        const doFill = !!fill, doStroke = !!stroke;

        x += rx;
        y += ry;
      
        while (stop - start >= epsilon) {
          arcToDraw = Math.min(stop - start, Math.PI/2);
          curves.push(this.acuteArcToBezier(start, arcToDraw));
          start += arcToDraw;
        }
      
        if (doFill) {
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
            context.fillStyle = fill;
            context.fill();
        }

        if (doStroke) {
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
            context.strokeStyle = stroke;
            context.stroke();
        }
    }
    
    image(img, x, y, w, h) {
        const context = this.getContext();
        context.drawImage(img, x, y, w, h);
    }
    
    background(fill) {
        const canvas = this.getCanvas();
        this.rect(0, 0, canvas.width, canvas.height, fill);
    }
}
