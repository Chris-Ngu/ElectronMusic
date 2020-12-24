const { ipcRenderer } = require("electron");

//sync
document.getElementById("getFileButton").addEventListener("click", (event) => {
    document.getElementById("sourceFileLocation").innerHTML = ipcRenderer.sendSync("open-file-dialog");
});

document.getElementById("getDestinationFileButton").addEventListener("click", (event) => {
    document.getElementById("destinationFileLocation").innerHTML = ipcRenderer.sendSync("open-file-dialog");
});
