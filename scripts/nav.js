const electron = require("electron");

document.getElementById("close-button").addEventListener("click", (event) => {
    electron.remote.BrowserWindow.getFocusedWindow().close();
});

document.getElementById("min-button").addEventListener("click", (event) => {
    electron.remote.BrowserWindow.getFocusedWindow().minimize();
});