const { BrowserWindow } = require("electron").remote;

document.getElementById("close-btn").addEventListener("click", (e) => {
    const window = BrowserWindow.getFocusedWindow();
    window.close();
});

document.getElementById("min-btn").addEventListener("click", (e) => {
    const window = BrowserWindow.getFocusedWindow();
    window.minimize();
});