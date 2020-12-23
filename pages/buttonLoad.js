const { ipcRenderer } = require("electron");

//sync
document.getElementById("getFileButton").addEventListener("click", (event) => {
    document.getElementById("fileLocation").innerHTML = ipcRenderer.sendSync("open-file-dialog");
});
