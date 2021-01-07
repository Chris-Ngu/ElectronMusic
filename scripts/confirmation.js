const ipcRenderer = require("electron").ipcRenderer;
let songToDelete;

ipcRenderer.on("delete-confirmation", (event, arg) => {
    document.getElementById("songToDelete").innerHTML = "Are you sure you want to delete " + arg + "?";
    songToDelete = arg;
});

document.getElementById("yesDelete").addEventListener("click", (event) => {
    const errors = ipcRenderer.sendSync("confirm-delete", songToDelete);
    if (errors === "No errors so far") {
        ipcRenderer.send("refresh-window");
        window.close();
    }
    else {
        ipcRenderer.send("ping", errors);
        document.getElementById("deleteErrors").innerHTML = errors;
    }
});

document.getElementById("noDelete").addEventListener("click", (event) => {
    window.close();
})