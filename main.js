import { kb } from './lib/keyboard.js'
import { logger } from './lib/logger.js'
import { mouse } from './lib/mouse.js'
import { asciiMap, renderer } from './lib/renderer.js'
import { pages } from './pages.js'
import { mainMenu } from './pages/main.js'
import { test } from './pages/test.js'

// const container = document.getElementById('container')
const asciicontainer = document.getElementById('asciicontainer')

window.w = 10
window.h = 10
window.showPerformance = false
window.frt = 0
window.logic = 0
window.asciiScreen = asciicontainer
window.page = 'main'
window.currentPage = window.page
const startPageId = 0
window.currentPageFunction = pages[startPageId].func
pages[startPageId].init()
window.fps = pages[startPageId].fps
window.clock = 0

let interval

function resizer() {
    window.w = Math.floor(window.innerWidth / (window.fsize * 0.66))
    window.h = Math.floor(window.innerHeight / (window.fsize * 1.22)) + 1

    asciiMap.init()
}

window.onload = function () {
    asciiMap.init()
    resizer()
    window.addEventListener('resize', resizer, false)

    updateFps(window.fps)

    mouse.init()
    kb.init()

    interval = setInterval(main, 1000 / 1000)
}


export function updateFps(fps) {
    clearInterval(interval)

    console.log('updated fps to', fps)

    window.fps = fps
    window.renderTime = 1000 / fps
    interval = setInterval(main, window.renderTime)
}

function main() {
    const start = performance.now()

    renderer.render()

    if (window.currentPage == window.page) {
        const s = performance.now()

        window.currentPageFunction()
        logger.log('logic', performance.now() - s)

        // if (window.clock % 200 === 1) {
        // }
    } else {
        pages.forEach(page => {
            if (page.name === window.page) {
                updateFps(page.fps)
                window.currentPage = window.page
                window.currentPageFunction = page.func
                page.init()
            }
        })
    }

    const end = performance.now()

    logger.log('rendertime', end - start)

    window.frameTime = end - start

    if (window.clock % 20 === 0) {
        const frt = logger.getLog('rendertime')
        window.frt = frt
        const logic = logger.getLog('logic')
        window.logic = logic
    }
}