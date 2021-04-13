import { app, BrowserWindow} from "electron";

const createWindow = ():void => {
    const win = new BrowserWindow({
        width: 1100,
        height: 900,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });

    win.loadURL("http://localhost:3000");
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => createWindow());