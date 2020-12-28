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

    if (requestedName.length == 0) {
        document.getElementById("song-rename-error").innerHTML = "Please select a song with length > 0";
    }
    else {
        document.getElementById("song-rename-error").innerText = requestedName + " is the new song name";
        // call IPCMAIN and set song name in main.js
    }
})
