const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require("fs");
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
            // preload: path.join(__dirname, "preload.js")
        },
    });
    win.loadFile("./pages/main.html");
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("open-file-dialog", (event) => {
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
            filters: [{
                name: "music",
                extensions: ["mp3"]
            }]
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

        return (filteredFiles);
    }
    catch {
        return ["Error reading file directory"];
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