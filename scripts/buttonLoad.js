const { ipcRenderer, remote } = require("electron");

/**
 * SYNCHRONOUS FUNCTION
 * Listens for button click and calls IPCMain thread to ask for files
 * Returns an object that contains the path and file paths
 * If error occurs, then response.error
 */
document.getElementById("getFileButton").addEventListener("click", (event) => {
    const response = ipcRenderer.sendSync("open-file-dialog");

    // Error message received here
    if (response.error) {
        document.getElementById("sourceFileLocation").innerHTML = response.error;
    }
    // No error message and have array of song lists
    else {
        document.getElementById("sourceFileLocation").innerHTML = "mp3s found here: " + response.files.length;

        // Creating buttons to append
        for (let i = 0; i < response.files.length; i++) {
            const tag = document.createElement("button");
            const tagLineSeperator = document.createElement("br");
            tag.appendChild(document.createTextNode(response.files[i]));
            tag.onclick = function () { songButtonClick(response.path + "\\" + response.files[i]) };
            document.getElementById("source-directory").appendChild(tag);
            document.getElementById("source-directory").appendChild(tagLineSeperator);
        }

    }
});

document.getElementById("getDestinationFileButton").addEventListener("click", (event) => {
    const response = ipcRenderer.sendSync("open-file-dialog");

    // Error message received here
    if (response.error) {
        document.getElementById("destinationFileLocation").innerHTML = response.error;
    }
    // No error message and have array of song lists
    else {
        document.getElementById("destinationFileLocation").innerHTML = "mp3s found here: " + response.files.length;

        // Creating buttons to append
        for (let i = 0; i < response.files.length; i++) {
            const tag = document.createElement("button");
            const tagLineSeperator = document.createElement("br");
            tag.appendChild(document.createTextNode(response.files[i]));
            tag.onclick = function () { songButtonClick(response.path + "\\" + response.files[i]) };
            document.getElementById("destination-directory").appendChild(tag);
            document.getElementById("destination-directory").appendChild(tagLineSeperator);
        }
    }
});

const songButtonClick = (songPath) => {
    //    ipcRenderer.send("song-button-click", songPath);
    const contextMenu = new remote.Menu();
    const playMenuItem = new remote.MenuItem({
        label: "Play song",
        click: () => {
            ipcRenderer.send("song-button-click", songPath);
        }
    });
    const renameMenuItem = new remote.MenuItem({
        label: "Rename song",
        click: () => {
            ipcRenderer.send("song-button-rename", songPath)
        }
    });
    contextMenu.append(playMenuItem);
    contextMenu.append(renameMenuItem);

    contextMenu.popup({
        window: remote.getCurrentWindow()
    });
}
