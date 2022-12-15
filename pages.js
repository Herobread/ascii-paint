import { initMain, mainMenu } from "./pages/main.js"
import { test } from "./pages/test.js"
import { animationViewer, initAnimationViewer } from "./utilityPages/viewAnimations.js"
import { assetsViewer, initAssetsViewer } from "./utilityPages/viewAssets.js"

const fps = 30

export const pages = [
    {
        name: 'main',
        func: mainMenu,
        fps: fps,
        init: initMain
    },
    {
        name: 'test',
        func: () => { test() },
        fps: fps,
        init: () => { }
    },

    /// utility pages
    {
        name: 'utility-asset-viewer',
        func: () => { assetsViewer() },
        fps: fps,
        init: () => { initAssetsViewer() }
    },
    {
        name: 'utility-animation-viewer',
        func: () => { animationViewer() },
        fps: fps,
        init: () => { initAnimationViewer() }
    }
]