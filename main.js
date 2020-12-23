const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require("path");


function createWindow() {
    const win = new BrowserWindow({
        backgroundColor: "#2e2c29",
        width: 800,
        height: 600,
        frame: true,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true,
            // preload: path.join(__dirname, "preload.js")
        },

    })

    win.loadFile("./pages/main.html");
    // getFile();
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

const getFile = () => {
    try {
        return (dialog.showOpenDialogSync({
            properties: ["openDirectory"]
        })[0]);
    }
    catch {
        return "Error reading file directory";
    };
}