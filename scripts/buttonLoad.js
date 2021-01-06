const { ipcRenderer, remote } = require("electron");

let initialSourceResponse;
let initialDestinationResponse;

document.getElementById("initialSongLoad").addEventListener("click", (event) => {
    let errors = false;
    if (initialSourceResponse.path.length == 0) {
        alert("Please select a source folder");
        errors = true;
    }
    if (initialDestinationResponse.path.length == 0) {
        alert("Please select a destination folder");
        errors = true;
    }

    //Call to assign all the buttons
    if (errors == false) {
        fillSource();
        fillDestination();
    }
})

const fillSource = () => {
    let response = initialSourceResponse;

    clearDiv("source-directory");
    // Creating buttons to append
    for (let i = 0; i < response.files.length; i++) {
        const tag = document.createElement("button");
        const tagLineSeperator = document.createElement("br");
        tag.appendChild(document.createTextNode(response.files[i]));

        const paths = {
            source: document.getElementById("sourcePath").innerHTML,
            destination: document.getElementById("destinationPath").innerHTML,
            songPath: response.path + "\\" + response.files[i],
            songName: response.files[i],
            sourceOrDestination: "source"
        };

        tag.onclick = function () { songButtonClick(paths) };
        document.getElementById("source-directory").appendChild(tag);
        document.getElementById("source-directory").appendChild(tagLineSeperator);
    }
}

const fillDestination = () => {
    let response = initialDestinationResponse;

    clearDiv("destination-directory");

    // Creating buttons to append
    for (let i = 0; i < response.files.length; i++) {
        const tag = document.createElement("button");
        const tagLineSeperator = document.createElement("br");
        tag.appendChild(document.createTextNode(response.files[i]));

        const paths = {
            source: document.getElementById("sourcePath").innerHTML,
            destination: document.getElementById("destinationPath").innerHTML,
            songPath: response.path + "\\" + response.files[i],
            songName: response.files[i],
            sourceOrDestination: "destination"
        };

        tag.onclick = function () { songButtonClick(paths) };
        document.getElementById("destination-directory").appendChild(tag);
        document.getElementById("destination-directory").appendChild(tagLineSeperator);
    }
}

document.getElementById("getFileButton").addEventListener("click", (event) => {
    const response = ipcRenderer.sendSync("open-file-dialog");
    if (response.error) {
        document.getElementById("sourceFileLocation").innerHTML = response.error;
    }
    else {
        //set number of files, directory, and initialCache
        initialSourceResponse = response;
        document.getElementById("sourceFileLocation").innerHTML = "mp3s found here: " + response.files.length;
        document.getElementById("sourcePath").innerHTML = response.path;
    }
});

/**
 * Same as the top function, just copied and pasted for destination
 */
document.getElementById("getDestinationFileButton").addEventListener("click", (event) => {
    const response = ipcRenderer.sendSync("open-file-dialog");
    if (response.error) {
        document.getElementById("destinationFileLocation").innerHTML = response.error;
    }
    else {
        //set number, directory, and cache
        initialDestinationResponse = response;
        document.getElementById("destinationFileLocation").innerHTML = "mp3s found here: " + response.files.length;
        document.getElementById("destinationPath").innerHTML = response.path;
    }
});

/**
 * THIS IS UNMAINTAINABLE IF THHIS IS GOING TO GROW 
 * NEED TO REFACTOR THIS WITH THE ABOVE TO TO CLEAN UP CODE
 * CAUSING SIDE EFFECTS/ MANUAL FLOW OF PROCESS
 */
ipcRenderer.on("refresh-window-webContents", (event) => {

    // Grab source and destination paths
    const sourcePath = document.getElementById("sourcePath").innerHTML;
    const destinationPath = document.getElementById("destinationPath").innerHTML;

    // Call main thread to grab the new names in the source directory
    const sourcePathSongs = ipcRenderer.sendSync("get-new-song-names", sourcePath);

    // Process new songs as buttons, refer to the top function
    clearDiv("source-directory");
    document.getElementById("sourceFileLocation").innerHTML = "mp3s found here: " + sourcePathSongs.length;
    document.getElementById("sourcePath").innerHTML = sourcePath;
    for (let i = 0; i < sourcePathSongs.length; i++) {
        const tag = document.createElement("button");
        const tagLineSeperator = document.createElement("br");
        tag.appendChild(document.createTextNode(sourcePathSongs[i]));

        const paths = {
            source: sourcePath,
            destination: destinationPath,
            songPath: sourcePath + "\\" + sourcePathSongs[i],
            songName: sourcePathSongs[i],
            sourceOrDestination: "source"
        };

        tag.onclick = function () { songButtonClick(paths) };
        document.getElementById("source-directory").appendChild(tag);
        document.getElementById("source-directory").appendChild(tagLineSeperator);
    };

    // Gets destination path and refreshes destination div (if not empty)
    // Leaves alone if either path/ returned value from main.js is empty
    const destinationPathSongs = ipcRenderer.sendSync("get-new-song-names", destinationPath);
    if (destinationPathSongs.length != 0) {
        clearDiv("destination-directory");

        document.getElementById("destinationFileLocation").innerHTML = "mp3s found here: " + destinationPathSongs.length;
        document.getElementById("destinationPath").innerHTML = destinationPath;
        for (let i = 0; i < destinationPathSongs.length; i++) {
            const tag = document.createElement("button");
            const tagLineSeperator = document.createElement("br");
            tag.appendChild(document.createTextNode(destinationPathSongs[i]));

            const paths = {
                source: sourcePath,
                destination: destinationPath,
                songPath: destinationPath + "\\" + destinationPathSongs[i],
                songName: destinationPathSongs[i],
                sourceOrDestination: "destination"
            };

            tag.onclick = function () { songButtonClick(paths) };
            document.getElementById("destination-directory").appendChild(tag);
            document.getElementById("destination-directory").appendChild(tagLineSeperator);
        };
    }

});

// Context menu shows up when you click the song button 
const songButtonClick = (songPath) => {
    const contextMenu = new remote.Menu();

    const playMenuItem = new remote.MenuItem({
        label: "Play song",
        click: () => {
            ipcRenderer.send("song-button-click", songPath.songPath);
        }
    });
    const renameMenuItem = new remote.MenuItem({
        label: "Rename song",
        click: () => {
            ipcRenderer.send("song-button-rename", songPath.songPath)
        }
    });

    const moveSongDirectory = new remote.MenuItem({
        label: "Move song to other directory",
        click: () => {
            const errors = ipcRenderer.sendSync("song-move", songPath);
            if (errors == "No errors so far") {
                ipcRenderer.send("refresh-window");
            }
            else {
                ipcRenderer.send("ping", errors);
            }
        }
    })
    contextMenu.append(playMenuItem);
    contextMenu.append(renameMenuItem);
    contextMenu.append(moveSongDirectory);

    contextMenu.popup({
        window: remote.getCurrentWindow()
    });
}

// Clears parent div
const clearDiv = (divID) => {
    const div = document.getElementById(divID);
    while (div.firstChild) {
        div.removeChild(div.lastChild);
    }
}