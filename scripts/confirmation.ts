import { deleteArg } from "../types/types";
const ipcRenderer = require("electron").ipcRenderer;

let songToDelete: string;

ipcRenderer.on("delete-confirmation", (_, arg: string) => {
    document.getElementById("songToDelete").innerHTML = "Are you sure you want to delete " + arg + "?";
    songToDelete = arg;
});

document.getElementById("yesDelete").addEventListener("click", (_) => {
    const errors = ipcRenderer.sendSync("confirm-delete", songToDelete);
    if (errors === "No errors so far") {
        ipcRenderer.send("refresh-window");

        const arg: deleteArg = {
            song: songToDelete,
            reason: "delete"
        };

        ipcRenderer.send("update-history", arg);

        window.close();
    }
    else {
        ipcRenderer.send("ping", errors);
        document.getElementById("deleteErrors").innerHTML = errors;
    }
});

document.getElementById("noDelete").addEventListener("click", (_) => {
    window.close();
});