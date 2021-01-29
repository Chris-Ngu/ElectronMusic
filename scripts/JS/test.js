var ipcRenderer = require("electron").ipcRenderer;
document.getElementById("getFileButton").addEventListener("click", function (_) {
    ipcRenderer.send("ping", "button clicked");
});
