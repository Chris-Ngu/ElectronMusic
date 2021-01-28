"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ipcRenderer = require("electron").ipcRenderer;
var songToDelete;
ipcRenderer.on("delete-confirmation", function (_, arg) {
    document.getElementById("songToDelete").innerHTML = "Are you sure you want to delete " + arg + "?";
    songToDelete = arg;
});
document.getElementById("yesDelete").addEventListener("click", function (_) {
    var errors = ipcRenderer.sendSync("confirm-delete", songToDelete);
    if (errors === "No errors so far") {
        ipcRenderer.send("refresh-window");
        var arg = {
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
document.getElementById("noDelete").addEventListener("click", function (_) {
    window.close();
});
//# sourceMappingURL=confirmation.js.map