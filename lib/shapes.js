import { renderer } from './renderer.js'

export const shapes = {
    line: function (symbol, x1, y1, x2, y2, plane) {
        // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

        let dx = Math.abs(x2 - x1)
        let sx = x1 < x2 ? 1 : -1
        let dy = -Math.abs(y2 - y1)
        let sy = y1 < y2 ? 1 : -1
        let error = dx + dy

        let end = false
        while (!end) {
            if (plane) {
                plane[[x1, y1]] = symbol
            } else {
                renderer.drawObject(symbol, x1, y1)
            }
            if (x1 == x2 && y1 == y2)
                end = true
            let e2 = 2 * error
            if (e2 >= dy) {
                if (x1 == x2)
                    end = true
                error = error + dy
                x1 = x1 + sx
            }
            if (e2 <= dx) {
                if (y1 == y2)
                    end = true
                error = error + dx
                y1 = y1 + sy
            }
        }
    },
    rectangle: function (symbol, x1, y1, x2, y2, plane) {
        this.line(symbol, x1, y1, x1, y2, plane)
        this.line(symbol, x1, y2, x2, y2, plane)
        this.line(symbol, x2, y1, x2, y2, plane)
        this.line(symbol, x1, y1, x2, y1, plane)
    },
    ellipse: function (symbol, x, y, a, b, plane) {
        a = Math.abs(x - a)
        b = Math.abs(y - b)
        let xlast = x;
        let ylast = y;

        for (var angle = 0; angle <= 720; angle++) {
            let X = parseInt(x + (a * Math.cos(angle * 2 * (Math.PI / 720))) + 0.5);
            let Y = parseInt(y + (b * Math.sin(angle * 2 * (Math.PI / 720))) + 0.5);
            if (xlast != X || ylast != Y) {
                xlast = X; ylast = Y;
            }
            if (plane) {
                plane[[X, Y]] = symbol
            } else {
                renderer.drawObject(symbol, X, Y)
            }
        }
    }
}