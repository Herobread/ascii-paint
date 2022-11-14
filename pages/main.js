import { drawer } from '../app-libraries/drawer.js'
import { art } from '../art.js'
import { animations } from '../lib/animations.js'
import { colisions } from '../lib/colisions.js'
import { gamepad } from '../lib/gamepad.js'
import { kb } from '../lib/keyboard.js'
import { mouse } from '../lib/mouse.js'
import { renderer } from '../lib/renderer.js'
import { shapes } from '../lib/shapes.js'
import { ui } from '../lib/ui.js'
import { randomInRange, randomInRangeFloat } from '../lib/util.js'

let symbol = '#'
let painting = drawer.init(300, 300, 0, 0)
let info = ''
let infoCooldown = 0
let drawCooldown = 0

// let isReplaceSelect = false

let latestPos = null
let mode = 'paint'

let IsUIActive = false
let isCoordsShown = false

// function resizer() {
//     const width = window.w
//     const height = window.h
//     painting = drawer.init(width, height, 0, 0)
// }

let dropDown

const onClose = () => {
    IsUIActive = false
}

const onOpen = () => {
    IsUIActive = true
}

function showInfo(info_, cooldown = -1) {
    info = info_
    infoCooldown = cooldown
}

export function initMain() {
    painting = drawer.init(300, 300, 0, 0)

    // window.addEventListener('resize', resizer)
}

export function mainMenu() {
    const pointer = mouse.info()
    const keyboard = kb.info()

    drawer.display()

    renderer.drawObject(symbol, 1, 0)

    if (infoCooldown > 0) {
        infoCooldown -= 1
    }

    let latestPressedKey = Object.entries(keyboard.new)[0]
    if (latestPressedKey) {
        latestPressedKey = latestPressedKey[0]
    }

    const transformOptions = [
        {
            content: `Replace ${symbol}`,
            pointer: pointer,
            onClick: () => {
                showInfo(`Replace ${symbol} to <select key by pressing it> or Ctrl + q to cancel.`)

                mode = 'replace'
            }
        }
    ]

    const fileOptions = [
        {
            content: `Export all`,
            onClick: () => {
                navigator.clipboard.writeText(drawer.allToString())

                showInfo('Saved all to clipboard.', 2000)
            }
        },
        {
            content: `Export only object`,
            onClick: () => {
                navigator.clipboard.writeText(drawer.getDrawing())

                // drawCooldown = 200

                showInfo('Saved object to clipboard.', 2000)
            }
        },
        {
            content: `Export to JSON`,
            onClick: () => {

                showInfo('Saved JSON to clipboard.', 2000)
                drawCooldown = 200
            }
        },
    ]


    const cursorOptions = [
        {
            content: isCoordsShown ? `Hide coordinates` : `Show coordinates`,
            pointer: pointer,
            onClick: () => {
                // showInfo(`somethin happend`, 500)
                isCoordsShown = !isCoordsShown
            }
        },
        {
            content: 'Keyboard mode(not done)',
            pointer: pointer,
            onClick: () => {
                showInfo(`somethin will happen`, 500)
                // isCoordsShown = !isCoordsShown
            }
        }
    ]

    let dropDownX = 5
    dropDown = ui.dropDown('File', fileOptions, dropDownX, 0, pointer, onOpen, onClose)
    dropDownX += dropDown.width + 1
    dropDown = ui.dropDown('Transform', transformOptions, dropDownX, 0, pointer, onOpen, onClose)
    dropDownX += dropDown.width + 1
    dropDown = ui.dropDown('Cursor', cursorOptions, dropDownX, 0, pointer, onOpen, onClose)


    if (mode === 'paint' && !IsUIActive) {
        if (pointer.down && pointer.y < window.h - 2) {
            drawer.putSymbol(symbol, pointer.x, pointer.y)

            if (latestPos)
                drawer.line(symbol, latestPos.x, latestPos.y, pointer.x, pointer.y)

            latestPos = {
                x: pointer.x,
                y: pointer.y
            }
        } else {
            latestPos = null
        }
    } else if (mode === 'replace') {
        if (latestPressedKey) {
            drawer.replace(symbol, latestPressedKey)

            showInfo(`Replaced.`, 2000)
            mode = 'paint'
        }
    }

    animations.move()
    animations.tick()

    animations.render()


    if (latestPressedKey)
        symbol = latestPressedKey

    let cursor = symbol
    if (cursor === ' ')
        cursor = '-'

    if (isCoordsShown)
        cursor += ` x:${pointer.x}\n  y:${pointer.y}`

    if (infoCooldown != 0) {
        renderer.drawObject(`${info} `, 2, window.h - 2)

        const hideInfo = () => {
            infoCooldown = 0
        }

        ui.button({
            content: 'close',
            x: 2 + info.length,
            y: window.h - 3,
            pointer: pointer,
            onClick: hideInfo,
            style: 'underlined'
        })
    }

    // renderer.drawObject(`[debug info] Mode:${mode}, isUIActive:${IsUIActive}`, 0, window.h - 3)

    mouse.showCursor(cursor)
}

/*

*/