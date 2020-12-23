const { app, BrowserWindow, dialog, ipcMain } = require('electron')

const getFile = () => {
    const files = dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    return files;
}


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile("./pages/loading.html");
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
    const files = getFile();
    console.log("Files here: " + files.filePaths);
    event.reply("open-file-dialog", files.filePaths);
});