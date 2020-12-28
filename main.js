const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require("fs");
const { shell } = require("electron");

// const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        backgroundColor: "#2e2c29",
        width: 800,
        height: 900,
        frame: true,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
            // preload: path.join(__dirname, "./scripts/preload.js")
        },
        resizable: false,
    });
    win.loadFile("./pages/main.html");
}

app.whenReady().then(createWindow)

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

/**
 * For the time being, this is playing the song in VLC/ default music player of the OS
 * In the future, I can either keep it like this or link it to the music player embeded in the UI
 */
ipcMain.on("song-button-click", (event, arg) => {
    // console.log(arg);
    try {
        shell.openPath(arg);
    } catch (ex) {
        console.log("Error occured while opening song file here: " + ex);
    }
});

ipcMain.on("song-button-rename", (event, arg) => {
    //Open window to ask for user input on new file name
    const childWindow = new BrowserWindow({ width: 450, height: 300 });
    childWindow.loadFile("./pages/songRename.html");
    // Use this to rename file 
    // https://stackoverflow.com/questions/22504566/renaming-files-using-node-js
})

ipcMain.on("open-file-dialog", (event, arg) => {
    const filePath = getFile();

    // sync
    event.returnValue = filePath;

    // async
    // event.reply("open-file-dialog", filePath);
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

/**
 * WIP, could replace this in the future if file type is not supported
 */
// const filterFiles = (array, ext) => {
//     let filteredFiles = [];
//     array.forEach((file) => {
//         if (file.substring(file.length - 3, file.length) === ext) {
//             filteredFiles.push(file);
//         }
//     });

//     return filteredFiles
// }