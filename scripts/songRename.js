const ipcRenderer = require("electron").ipcRenderer;
let songPath;

ipcRenderer.on("song-name", (event, arg) => {
    // document.getElementById("song-name-here").innerHTML = arg
    songPath = arg;
});

document.getElementById("song-rename-cancel-button").addEventListener("click", (event) => {
    window.close();
});

document.getElementById("song-rename-accept-button").addEventListener("click", (event) => {
    const requestedName = document.getElementById("song-rename-newName").value;
    // Can filter input here based on ASCII acceptable characters

    if (requestedName.length == 0) {
        //Handle file name exceptions here
        // Need to check if only input has OS acceptable characters ASCII
        document.getElementById("song-rename-error").innerHTML = "Please select a song with length > 0";
    }
    else {
        // call IPCMAIN and set song name in main.js

        const arg = {
            path: songPath,
            original: songPath.substring(songPath.lastIndexOf("\\") + 1, songPath.length),
            modified: requestedName + ".mp3"
        };

        ipcRenderer.send("song-rename-decision", arg);
    }
})
