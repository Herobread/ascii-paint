import { art } from '../art.js'
import { animations } from '../lib/animations.js'
import { colisions } from '../lib/colisions.js'
import { gamepad } from '../lib/gamepad.js'
import { logger } from '../lib/logger.js'
import { mouse } from '../lib/mouse.js'
import { renderer } from '../lib/renderer.js'
import { shapes } from '../lib/shapes.js'
import { ui } from '../lib/ui.js'
import { randomInRange, randomInRangeFloat } from '../lib/util.js'

export async function test() {
    const pointer = mouse.info()

    if (pointer.down) {
        for (let i = 0; i < 200; i += 1) {
            animations.animate(
                art.animations.particle,
                pointer.x,
                pointer.y,
                randomInRangeFloat(-2, 2),
                randomInRangeFloat(-1, 1),
                {
                    loop: false,
                    tickSpeed: randomInRange(1, 10),
                    moveSpeed: 2
                }
            )
        }
    } else {
        renderer.drawObject(`Click to create a lot of 144 fps particles! `, pointer.x + 3, pointer.y)
    }

    ui.button({
        content: 'Go to main.js',
        x: 5,
        y: 10,
        pointer: pointer,
        onClick: () => {
            window.page = 'main'
        },
    })

    animations.move()
    animations.tick()

    animations.render()

    mouse.showCursor()
}