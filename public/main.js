"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var fs_1 = require("fs");
var types_1 = require("../src/types");
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 1100,
        height: 900,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            preload: __dirname + "/preload.js"
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
electron_1.ipcMain.on("open-file-dialog", function (event, arg) {
    var filePath = getFile();
    event.returnValue = filePath;
});
var getFile = function () {
    var audioFormats = ["wav", "mp3", "flac", "ogg", "aac", "wma"];
    try {
        var filePath = electron_1.dialog.showOpenDialog({
            properties: ["openDirectory"]
        })[0];
        var files_1 = fs_1.readdirSync(filePath);
        var filteredFiles_1 = [];
        files_1.forEach(function (file) {
            if (audioFormats.includes(file.substring(files_1.length - 3, files_1.length).toLowerCase())) {
                filteredFiles_1.push(file);
            }
        });
        var returnValue = {
            path: filePath,
            files: filteredFiles_1
        };
        return returnValue;
    }
    catch (_a) {
        return { error: types_1.OPENFILEDIALOGERROR };
    }
};
electron_1.app.whenReady().then(function () { return createWindow(); });
