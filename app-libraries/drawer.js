import { renderer } from "../lib/renderer.js"
import { cropImg } from "../lib/util.js"

export const drawer = {
    image: Array(10).fill(' ').map(() => Array(10)),
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    init: function (width, height, x = 0, y = 0) {
        console.log(`initialized with ${width} ${height} ${x} ${y}`)
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.image = Array(height).fill('#').map(() => Array(width))
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                // console.log(y, x)
                this.image[y][x] = ' '
            }
        }
    },
    putSymbol: function (symbol, x, y) {
        const realX = x - this.x
        const realY = y - this.y
        if (realX >= 0 && realX < this.width && realY >= 0 && realY < this.height)
            this.image[realY][realX] = symbol
    },

    display: function () {
        this.image.forEach((row, y) => {
            // console.log(row)
            row.forEach((symbol, x) => {
                if (symbol)
                    renderer.drawSymbol(symbol, x + this.x, y + this.y)
            })
        })
    },
    replace: function (from, to) {
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.image[y][x] === from) {
                    this.image[y][x] = to
                }
            }
        }
    },
    line: function (symbol, x1, y1, x2, y2) {
        // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

        let dx = Math.abs(x2 - x1)
        let sx = x1 < x2 ? 1 : -1
        let dy = -Math.abs(y2 - y1)
        let sy = y1 < y2 ? 1 : -1
        let error = dx + dy

        let end = false
        while (!end) {
            this.putSymbol(symbol, x1, y1)

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

        for (let angle = 0; angle <= 720; angle++) {
            let X = parseInt(x + (a * Math.cos(angle * 2 * (Math.PI / 720))) + 0.5);
            let Y = parseInt(y + (b * Math.sin(angle * 2 * (Math.PI / 720))) + 0.5);
            if (xlast != X || ylast != Y) {
                xlast = X; ylast = Y;
            }

            this.putSymbol(symbol, x1, y1)
        }
    },
    allToString: function () {
        let res = ''
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                res += this.image[y][x]
            }
            res += '\n'
        }

        return res
    },
    getDrawing: function () {
        let left = 999
        let right = 0
        let top = 999
        let bottom = 0

        for (let y = 1; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.image[y][x] !== ' ') {
                    left = Math.min(left, x)
                    right = Math.max(right, x)
                    top = Math.min(top, y)
                    bottom = Math.max(bottom, y)
                }
            }
        }

        return this.cropImg(left, top, right + 1, bottom + 1)
    },
    getDrawingSize: function () {
        let left = 999
        let right = 0
        let top = 999
        let bottom = 0

        for (let y = 1; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.image[y][x] !== ' ') {
                    left = Math.min(left, x)
                    right = Math.max(right, x)
                    top = Math.min(top, y)
                    bottom = Math.max(bottom, y)
                }
            }
        }

        return {
            width: right - left,
            height: bottom - top
        }
    },
    getJSONDrawing: function () {
        const drawingSizes = this.getDrawingSize()

        let object = `name: {
    img: ${this.getDrawing()},
    width: drawingSizes.width,
    height: drawingSizes.height
}`

        return object
    },
    cropImg: function (startX, startY, endX, endY) {
        let res = ''

        for (let y = startY; y < endY; y += 1) {
            for (let x = startX; x < endX; x += 1) {
                if (this.image[y][x] == ' ') {
                    res += ' '
                } else {
                    res += this.image[y][x]
                }
            }
            res += '\n'
        }

        return res
    }
}