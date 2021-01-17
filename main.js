const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require("fs");
const { shell } = require("electron");

// Main window instance
let win;

const createWindow = () => {
    win = new BrowserWindow({
        //         backgroundColor: "#2e2c29",
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

app.whenReady().then(() => createWindow());

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

// Starts song using default system player
ipcMain.on("song-button-click", (event, arg) => {
    try {
        shell.openPath(arg);
    } catch (ex) {
        console.log("Error occured while opening song file here: " + ex);
    }
});

ipcMain.on("song-button-rename", (event, arg) => {
    // New user input window
    const childWindow = new BrowserWindow({
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
        .then(() => childWindow.webContents.send("song-name", arg));
})

// Synchrounous 
ipcMain.on("open-file-dialog", (event, arg) => {
    const filePath = getFile();
    event.returnValue = filePath;
});

// SYNCHRONOUS
// Renames song and returns an error code based on fs error
ipcMain.on("song-rename-decision", (event, arg) => {
    // https://stackoverflow.com/questions/22504566/renaming-files-using-node-js
    // console.log("originalPath: " + arg.originalPath);
    // console.log("Modified: " + arg.modifiedPath);

    fs.rename(arg.originalPath, arg.modifiedPath, (err) => {
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
// Handle non-existing folder here (if exists)
ipcMain.on("song-move", (event, arg) => {
    const songSourcePath = arg.source + "\\" + arg.songName;
    const songDestinationPath = arg.destination + "\\" + arg.songName;

    // swapping from source to destination
    if (arg.sourceOrDestination === "source") {
        fs.rename(songSourcePath, songDestinationPath, (err) => {
            if (err) {
                event.returnValue = err;
            }
            else {
                event.returnValue = "No errors so far";
            }
        });
    }
    else if (arg.sourceOrDestination === "destination") {
        fs.rename(songDestinationPath, songSourcePath, (err) => {
            if (err) {
                event.returnValue = err;
            }
            else {
                event.returnValue = "No errors so far";
            }
        });
    }
    else {
        console.log("ERROR OCCURED WHILE MOVING FILES: COULD NOT DETERMINE IF DESTINATION OR SOURCE");
        event.returnValue = "ERROR";
    }

});

ipcMain.on("song-delete", (event, arg) => {
    // Create new window here to ask if user wants to delete
    const confirmationWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    confirmationWindow.loadFile("./pages/confirmation.html")
        .then(() => confirmationWindow.webContents.send("delete-confirmation", arg));
});

ipcMain.on("confirm-delete", (event, arg) => {
    try {
        fs.unlinkSync(arg);
        event.returnValue = "No errors so far";
    } catch (err) {
        event.returnValue = err;
    }
})

// Tells the main window to refresh itself
ipcMain.on("refresh-window", (event, arg) => {
    win.webContents.send("refresh-window-webContents");
})

// Ping function to test connections and arguments from render thread
ipcMain.on("ping", (event, arg) => {
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
ipcMain.on("get-new-song-names", (event, args) => {
    let filteredFiles = [];

    try {
        const files = fs.readdirSync(args);

        // cleaning out all files that are not .mp3
        files.forEach((file) => {
            if (file.substring(file.length - 3, file.length) === "mp3") {
                filteredFiles.push(file);
            }
        });

        event.returnValue = filteredFiles;
    } catch (exception) {
        console.log("Error occured while trying to read diretory: " + exception);
        event.returnValue = [];
    }
});

ipcMain.on("update-history", (event, arg) => {
    win.webContents.send("update-history-main-window", arg);
});

/**
 * Reads directory given upon window promp
 * Returns Array of files inside directory
 * If there is an error, an array of length 1 is returned with error message
 */
const getFile = () => {
    try {
        // Get folder path here
        const filePath = dialog.showOpenDialogSync({
            properties: ["openDirectory"],
        })[0];

        // Finding all files in the folder
        const files = fs.readdirSync(filePath);
        let filteredFiles = [];

        // Filtering based on file type
        files.forEach((files) => {
            if (files.substring(files.length - 3, files.length) === "mp3") {
                filteredFiles.push(files);
            }
        });

        const returnValue = {
            path: filePath,
            files: filteredFiles
        };
        return (returnValue);
    }
    catch {
        return {
            error: "No directory selected"
        };
    };
}