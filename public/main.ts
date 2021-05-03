import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from "electron";
import { readdirSync } from "fs";
import { pathToFileURL } from "node:url";
import { OpenDialog, OPENFILEDIALOGERROR } from "../src/types";

const createWindow = (): void => {
    const win = new BrowserWindow({
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
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on("open-file-dialog", (event: IpcMainEvent, arg): void => {
    const filePath = getFile();
    event.returnValue = filePath;
});

const getFile = (): OpenDialog => {
    // const audioFormats = ["wav", "mp3", "flac", "ogg", "aac", "wma"];
    const audioFormats = ["flac"];
    try {
        const filePath: string = dialog.showOpenDialogSync({
            properties: ["openDirectory"],
        })[0];

        const files = readdirSync(filePath);
        let filteredFiles: string[] = [];

        files.forEach((file: string) => {
            // if (audioFormats.includes(file.substring(file.length - 3, file.length).toLowerCase())) {
            filteredFiles.push(file);
            // }
        });

        const returnValue: OpenDialog = {
            path: filePath,
            files: filteredFiles
        }

        return returnValue;
    } catch (error) {
        return { error: error }
    }
}

app.whenReady().then(() => createWindow());