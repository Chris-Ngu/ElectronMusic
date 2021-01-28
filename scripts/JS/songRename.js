"use strict";
exports.__esModule = true;
var ipcRenderer = require("electron").ipcRenderer;
var songPath;
ipcRenderer.on("song-name", function (_, arg) {
    songPath = arg.songPath;
    document.getElementById("original-song-name").innerHTML = arg.songName;
});
document.getElementById("song-rename-cancel-button").addEventListener("click", function (_) {
    window.close();
});
document.getElementById("song-rename-accept-button").addEventListener("click", function (event) {
    var requestedName = document.getElementById("song-rename-newName").value;
    // Can filter input here based on ASCII acceptable characters
    // Handle file name exceptions here
    // Need to check if only input has OS acceptable characters ASCII
    if (requestedName.length == 0) {
        document.getElementById("song-rename-error").innerHTML = "Please select a song with length > 0";
    }
    else {
        // call IPCMAIN and set song name in main.js
        var arg = {
            originalPath: songPath,
            modifiedPath: songPath.replace(songPath.substring(songPath.lastIndexOf("\\") + 1, songPath.length), requestedName + ".mp3"),
            reason: "rename"
        };
        var errors = ipcRenderer.sendSync("song-rename-decision", arg);
        ipcRenderer.send("update-history", arg);
        if (errors === "No errors so far") {
            // Tell main window to refresh here
            ipcRenderer.send("refresh-window");
            window.close();
        }
        else {
            document.getElementById("song-rename-error").innerHTML = errors;
        }
    }
});
