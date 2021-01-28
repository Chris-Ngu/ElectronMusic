"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = __importDefault(require("fs"));
// Main window instance
var win;
var createWindow = function () {
    win = new electron_1.BrowserWindow({
        // backgroundColor: "#2e2c29",
        width: 1100,
        height: 900,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        resizable: false,
    });
    win.loadFile("./pages/main.html");
};
electron_1.app.whenReady().then(function () { return createWindow(); });
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// Starts song using default system player
electron_1.ipcMain.on("song-button-click", function (_, arg) {
    try {
        electron_1.shell.openPath(arg);
    }
    catch (ex) {
        console.log("Error occured while opening song file here: " + ex);
    }
});
electron_1.ipcMain.on("song-button-rename", function (_, arg) {
    // New user input window
    var childWindow = new electron_1.BrowserWindow({
        width: 450,
        height: 300,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });
    childWindow.loadFile("./pages/songRename.html")
        .then(function () { return childWindow.webContents.send("song-name", arg); });
});
// SYNCHRONOUS 
electron_1.ipcMain.on("open-file-dialog", function (event, _) {
    var filePath = getFile();
    event.returnValue = filePath;
});
// SYNCHRONOUS
electron_1.ipcMain.on("song-rename-decision", function (event, arg) {
    // https://stackoverflow.com/questions/22504566/renaming-files-using-node-js
    fs_1.default.rename(arg.originalPath, arg.modifiedPath, function (err) {
        if (err) {
            event.returnValue = err;
        }
        else {
            event.returnValue = "No errors so far";
        }
    });
});
// SYNCHRONOUS 
// Moves selected song into a different folder
electron_1.ipcMain.on("song-move", function (event, arg) {
    var songSourcePath = arg.source + "\\" + arg.songName;
    var songDestinationPath = arg.destination + "\\" + arg.songName;
    // swapping from source to destination
    if (arg.sourceOrDestination === "source") {
        fs_1.default.rename(songSourcePath, songDestinationPath, function (err) {
            if (err) {
                event.returnValue = err;
            }
            else {
                var info = {
                    from: songSourcePath,
                    to: songDestinationPath,
                    reason: "move"
                };
                win.webContents.send("update-history-main-window", info);
                event.returnValue = "No errors so far";
            }
        });
    }
    else if (arg.sourceOrDestination === "destination") {
        fs_1.default.rename(songDestinationPath, songSourcePath, function (err) {
            if (err) {
                event.returnValue = err;
            }
            else {
                var info = {
                    to: songSourcePath,
                    from: songDestinationPath,
                    reason: "move"
                };
                win.webContents.send("update-history-main-window", info);
                event.returnValue = "No errors so far";
            }
        });
    }
    else {
        console.log("ERROR OCCURED WHILE MOVING FILES: COULD NOT DETERMINE IF DESTINATION OR SOURCE");
        event.returnValue = "ERROR";
    }
});
electron_1.ipcMain.on("song-delete", function (_, arg) {
    var confirmationWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    confirmationWindow.loadFile("./pages/confirmation.html")
        .then(function () { return confirmationWindow.webContents.send("delete-confirmation", arg); });
});
electron_1.ipcMain.on("confirm-delete", function (event, arg) {
    try {
        fs_1.default.unlinkSync(arg);
        event.returnValue = "No errors so far";
    }
    catch (err) {
        event.returnValue = err;
    }
});
// Tells the main window to refresh itself
electron_1.ipcMain.on("refresh-window", function () {
    win.webContents.send("refresh-window-webContents");
});
// Ping function to test connections and arguments from render thread
electron_1.ipcMain.on("ping", function (_, arg) {
    console.log("PING RECEIVED");
    if (arg) {
        console.log("ARGUMENT RECEIVED: " + arg);
    }
});
/**
 * SYNC FUNCTION
 * Input: folder path
 * Returns: array of .mp3 files found in input path
 */
electron_1.ipcMain.on("get-new-song-names", function (event, args) {
    var filteredFiles = [];
    try {
        var files = fs_1.default.readdirSync(args);
        // cleaning out all files that are not .mp3
        files.forEach(function (file) {
            if (file.substring(file.length - 3, file.length) === "mp3") {
                filteredFiles.push(file);
            }
        });
        event.returnValue = filteredFiles;
    }
    catch (exception) {
        console.log("Error occured while trying to read diretory: " + exception);
        event.returnValue = [];
    }
});
electron_1.ipcMain.on("update-history", function (_, arg) {
    win.webContents.send("update-history-main-window", arg);
});
/**
 * Reads directory given upon window promp
 * Returns Array of files inside directory
 * If there is an error, an array of length 1 is returned with error message
 */
var getFile = function () {
    try {
        // Get folder path here
        var filePath = electron_1.dialog.showOpenDialogSync({
            properties: ["openDirectory"],
        })[0];
        // Finding all files in the folder
        var files = fs_1.default.readdirSync(filePath);
        var filteredFiles_1 = [];
        // Filtering based on file type
        files.forEach(function (files) {
            if (files.substring(files.length - 3, files.length) === "mp3") {
                filteredFiles_1.push(files);
            }
        });
        var returnValue = {
            path: filePath,
            files: filteredFiles_1
        };
        return (returnValue);
    }
    catch (_a) {
        return {
            error: "No directory selected"
        };
    }
    ;
};
//# sourceMappingURL=main.js.map