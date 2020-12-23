const { ipcRenderer } = require("electron");

const getFile = () => {
    let reply = ipcRenderer.sendSync("open-file-dialog");
    document.getElementById("fileLocation").innerHTML = reply[0];
}