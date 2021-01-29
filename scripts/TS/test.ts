const { ipcRenderer } = require("electron");
document.getElementById("getFileButton").addEventListener("click", (_) => {
    ipcRenderer.send("ping", "button clicked");
})