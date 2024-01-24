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
let object = ''
let mode = 'paint'

let painting = drawer.init(300, 300, 0, 0)

let info = ''
let infoCooldown = 0

let latestPos = null

let IsUIActive = false // prevents drawing if clicking on any ui buttons
let isCoordsShown = false
let isKeyboardMode = false

let pointerX = 20
let pointerY = 20
let pointerBlinkCooldown = 200
const MAX_POINTER_BLINK_COOLDOWN = 200

let dropDown = {}

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

function copyObject() {
	navigator.clipboard.writeText(drawer.getDrawing())

	// drawCooldown = 200

	showInfo('Saved object to clipboard.', 2000)

}

function loadFromClipboard(){

		navigator.clipboard.readText()
			.then(data => {
				console.log(data)
				object = data.replaceAll('\t', '  ').replaceAll('\r', '')

				if (!object) {
					showInfo('Clipboard is empty', -1)
				} else {
					showInfo('Select a place to paste clipboard.', -1)

					mode = 'paste once'
				}
			})
			.catch(error => {
				showInfo(`${error}`, -1)

				showInfo('Failed to load object from clipboard.', -1)
			})

		// drawCooldown = 200
	
}

export function initMain() {
	painting = drawer.init(300, 300, 0, 0)
}

export function mainMenu() {
	const pointer = mouse.info()
	const keyboard = kb.info()

	// Check if CTRL key is pressed
	if (keyboard.new['c']?.ctrl) {
		copyObject()
		return
	}
	if (keyboard.new['v']?.ctrl) {
		loadFromClipboard()
		return
	}
	// Handle CTRL+C functionality
	if (keyboard.new['c']?.ctrl) {
		// CTRL+C pressed, copy content to clipboard
		navigator.clipboard.writeText(drawer.getDrawing());
		showInfo('Copied to clipboard.', 2000);
	}



	if (isKeyboardMode) {
		const isPointerInPainting = pointer.y > 1 && pointer.y < window.h
		if (pointer.click && isPointerInPainting) {
			pointerX = pointer.x
			pointerY = pointer.y
		}
		if (keyboard.new['ArrowUp']) {
			pointerY -= 1

			pointerBlinkCooldown = MAX_POINTER_BLINK_COOLDOWN
		}
		if (keyboard.new['ArrowDown']) {
			pointerY += 1

			pointerBlinkCooldown = MAX_POINTER_BLINK_COOLDOWN
		}
		if (keyboard.new['ArrowLeft']) {
			pointerX -= 1

			pointerBlinkCooldown = MAX_POINTER_BLINK_COOLDOWN
		}
		if (keyboard.new['ArrowRight']) {
			pointerX += 1

			pointerBlinkCooldown = MAX_POINTER_BLINK_COOLDOWN
		}
	} else {
		pointerX = pointer.x
		pointerY = pointer.y
	}

	drawer.display()

	renderer.drawObject(symbol, 1, 0)

	if (infoCooldown > 0) {
		infoCooldown -= 1
	}
	pointerBlinkCooldown -= 1
	if (pointerBlinkCooldown < 0) {
		pointerBlinkCooldown = MAX_POINTER_BLINK_COOLDOWN
	}

	let latestPressedKey = Object.entries(keyboard.new)[0]
	if (latestPressedKey) {
		latestPressedKey = latestPressedKey[0]
	}

	const transformOptions = [
		{
			content: mode === 'replace' ? `Cancel replace` : `Replace '${symbol}'`,
			pointer: pointer,
			onClick: () => {
				showInfo(`Replace ${symbol} to <select key by pressing it>.`)

				if (mode !== 'replace')
					mode = 'replace'
				else {
					showInfo(`Canceled replace.`, 500)

					mode = 'paint'
				}
			}
		},
		{
			content: 'To transperency map',
			pointer: pointer,
			onClick: () => {
				drawer.toTransperency()
				showInfo(`Converted successfully.`, 500)
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
			onClick: copyObject
		},
		{
			content: `Export to JSON`,
			onClick: () => {
				navigator.clipboard.writeText(drawer.getJSONDrawing())

				showInfo('Saved JSON to clipboard.', 2000)
				// drawCooldown = 200
			}
		},
		{
			content: `Export as tm`,
			onClick: () => {
				navigator.clipboard.writeText(drawer.getTM())

				showInfo('Exported as transperency map to clipboard.', 2000)
				// drawCooldown = 200
			}
		},
		{
			content: '-',
			split: true
		},
		{
			content: `Load from clipboard`,
			onClick: loadFromClipboard
		},
	]


	const cursorOptions = [
		{
			content: isCoordsShown ? `Hide coordinates` : `Show coordinates`,
			pointer: pointer,
			onClick: () => {
				isCoordsShown = !isCoordsShown
				if (isCoordsShown) {
					showInfo(`Coordinates are shown`, 500)
				} else {
					showInfo(`Coordinates are hidden`, 500)
				}
			}
		},
		{
			content: isKeyboardMode ? 'Mouse mode' : 'Keyboard mode',
			pointer: pointer,
			onClick: () => {
				isKeyboardMode = !isKeyboardMode

				if (isKeyboardMode) {
					showInfo(`Keyboard mode is on`, 500)
				} else {
					showInfo(`Keyboard mode is off`, 500)
				}
			}
		}
	]

	let dropDownX = 5
	dropDown = ui.dropDown('File', fileOptions, dropDownX, 0, pointer, onOpen, onClose)
	dropDownX += dropDown.width + 1
	dropDown = ui.dropDown('Transform', transformOptions, dropDownX, 0, pointer, onOpen, onClose)
	dropDownX += dropDown.width + 1
	let cursorDropwdownName = isKeyboardMode ? 'Cursor(KB)' : 'Cursor(M)'
	dropDown = ui.dropDown(cursorDropwdownName, cursorOptions, dropDownX, 0, pointer, onOpen, onClose)


	if (mode === 'paint' && !IsUIActive) {
		const isNotInInfoPanel = pointerY < window.h - 1
		const isNotInToolsPanel = pointerY > 0
		// if not in kb mode: get pointer.down event
		// else if in kb mode: if enter pressed
		const isValidClick = ((pointer.down && !isKeyboardMode) || keyboard.down['Enter'])
		if (isValidClick && isNotInToolsPanel && isNotInInfoPanel) {
			drawer.putSymbol(symbol, pointerX, pointerY)

			if (latestPos)
				drawer.line(symbol, latestPos.x, latestPos.y, pointerX, pointerY)

			latestPos = {
				x: pointerX,
				y: pointerY
			}
		} else {
			latestPos = null
		}
	} else if (mode === 'replace') {
		if (latestPressedKey && latestPressedKey.length === 1) {
			drawer.replace(symbol, latestPressedKey)

			showInfo(`Replaced.`, 2000)
			mode = 'paint'
		}
	} else if (mode === 'paste once') {
		renderer.drawObject(object, pointerX, pointerY)

		if (pointer.click) {
			drawer.putObject(object, pointerX, pointerY)

			showInfo(`Clipboard pasted.`, 2000)
			mode = 'paint'
		}
	}

	animations.move()
	animations.tick()

	animations.render()


	if (latestPressedKey && latestPressedKey.length == 1) {
		symbol = latestPressedKey

		if (isKeyboardMode) {
			drawer.putSymbol(symbol, pointerX, pointerY)
		}
	}

	let cursor = symbol
	if (cursor === ' ')
		cursor = '-'

	if (isCoordsShown)
		cursor += ` x:${pointerX}\n  y:${pointerY}`

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

	// cursor += `  ${drawer.getSymbol(pointerX, pointerY).charCodeAt(0)}  `

	if (isKeyboardMode) {
		if (pointerBlinkCooldown > 75)
			renderer.drawObject(cursor, pointerX, pointerY)
		mouse.showCursor('+')
	} else {
		mouse.showCursor(cursor)
	}
}

/*

*/