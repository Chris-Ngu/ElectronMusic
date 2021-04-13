"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 1100,
        height: 900,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    win.loadURL("http://localhost:3000");
};
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
electron_1.app.whenReady().then(function () { return createWindow(); });
