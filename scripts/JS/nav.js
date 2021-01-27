var electron = require("electron");
document.getElementById("close-button").addEventListener("click", function (event) {
    electron.remote.BrowserWindow.getFocusedWindow().close();
});
document.getElementById("min-button").addEventListener("click", function (event) {
    electron.remote.BrowserWindow.getFocusedWindow().minimize();
});
