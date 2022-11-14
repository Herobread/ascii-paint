let objects

export const colisions = {
    /**
     * @param  {number} x1 x coordinate of the point
     * @param  {number} y1 y coordinate of the point
     * @param  {number} x x coordinate of the rectangle
     * @param  {number} y y coordinate of the rectangle
     * @param  {number} w width of the rectangle
     * @param  {number} h height of the rectangle
     * @return {boolean} if point in rectangle => true
     */
    checkPointInSquare: function (x1, y1, x, y, w, h) {
        x1 = Math.floor(x1)
        y1 = Math.floor(y1)
        x = Math.floor(x)
        y = Math.floor(y)
        w = Math.floor(w)
        h = Math.floor(h)

        const checkWidth = x <= x1 && x1 < x + w
        const checkHeight = y <= y1 && y1 < y + h

        // console.log(x1, x, x + w, y1, y, y + h, checkHeight && checkWidth)

        if (checkHeight && checkWidth) {
            return true
        }
        return false
    }
}