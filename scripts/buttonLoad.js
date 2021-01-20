const { ipcRenderer, remote, TouchBarSlider } = require("electron");

let initialSourceResponse; //initialResponse type
let initialDestinationResponse; //initialResponse type
let historyStack = [];

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
        document.getElementById("source-directory").style.opacity = 1;
        document.getElementById("destination-directory").style.opacity = 1;
        document.getElementById("historyStackInfo").style.opacity = 1;
        initialFill("source");
        initialFill("destination");
    }
})

const initialFill = (sourceOrDestination) => {
    let response;
    if (sourceOrDestination === "source") {
        response = initialSourceResponse;
        clearDiv("source-directory");
    }
    else {
        response = initialDestinationResponse;
        clearDiv("destination-directory");
    }

    for (let i = 0; i < response.files.length; i++) {
        const tag = document.createElement("button");
        const tagLineSeperator = document.createElement("br");
        tag.appendChild(document.createTextNode(response.files[i]));

        const paths = {
            source: document.getElementById("sourcePath").innerHTML,
            destination: document.getElementById("destinationPath").innerHTML,
            songPath: response.path + "\\" + response.files[i],
            songName: response.files[i],
        }
        if (sourceOrDestination === "source") {
            paths.sourceOrDestination = "source";
        } else {
            paths.sourceOrDestination = "destination";
        }

        tag.onclick = function () { songButtonClick(paths) };
        if (sourceOrDestination == "source") {
            document.getElementById("source-directory").appendChild(tag);
            document.getElementById("source-directory").appendChild(tagLineSeperator);
        } else {
            document.getElementById("destination-directory").appendChild(tag);
            document.getElementById("destination-directory").appendChild(tagLineSeperator);
        }
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

    // refresh cache
    initialSourceResponse = {
        files: sourcePathSongs,
        path: sourcePath
    };

    // Process new songs as buttons, refer to the top function
    clearDiv("source-directory");
    document.getElementById("sourceFileLocation").innerHTML = "mp3s found here: " + sourcePathSongs.length;
    document.getElementById("sourcePath").innerHTML = sourcePath;
    for (let i = 0; i < sourcePathSongs.length; i++) {
        const tag = document.createElement("button");
        const tagLineSeperator = document.createElement("br");
        tag.appendChild(document.createTextNode(sourcePathSongs[i]));

        // paths type
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

        // refreshing cache
        initialDestinationResponse = {
            files: destinationPathSongs,
            path: destinationPath
        }

        document.getElementById("destinationFileLocation").innerHTML = "mp3s found here: " + destinationPathSongs.length;
        document.getElementById("destinationPath").innerHTML = destinationPath;
        for (let i = 0; i < destinationPathSongs.length; i++) {
            const tag = document.createElement("button");
            const tagLineSeperator = document.createElement("br");
            tag.appendChild(document.createTextNode(destinationPathSongs[i]));

            // paths type
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

ipcRenderer.on("update-history-main-window", (event, arg) => {
    createHistoryItem(arg);
});

// Not working, need to test this
const createHistoryItem = (arg) => {
    const argTypes = ["move", "rename", "delete"];
    if (!argTypes.includes(arg.reason)) {
        return ipcRenderer.send("ping", arg.reason + ": Arg reason could not supported");
    }

    const tag = document.createElement("div");
    const tagLineSeperator = document.createElement("hr");
    const date = new Date();

    tag.className = "historyItems";
    tag.appendChild(document.createTextNode(date.toTimeString().substring(0, 8) + ": " + arg.reason + " song"));
    tag.appendChild(document.createElement("br"));

    if (arg.reason === "rename") {
        tag.appendChild(document.createTextNode(arg.originalPath.substring(arg.originalPath.lastIndexOf("\\") + 1, arg.originalPath.length - 4) + " --> " + arg.modifiedPath.substring(arg.modifiedPath.lastIndexOf("\\") + 1, arg.modifiedPath.length - 4)));
    }
    else if (arg.reason === "delete") {
        tag.appendChild(document.createTextNode(arg.song.substring(0, arg.song.length - 4)));
    }
    else if (arg.reason === "move") {
        tag.appendChild(document.createTextNode(arg.from + " ---->" + arg.to));
    }

    document.getElementById("historyStackInfo").appendChild(tag);
    document.getElementById("historyStackInfo").appendChild(tagLineSeperator);

    historyStack.push(arg);

}

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
            ipcRenderer.send("song-button-rename", songPath)
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
    });
    const songDelete = new remote.MenuItem({
        label: "Delete song",
        click: () => {
            ipcRenderer.send("song-delete", songPath.songPath);
        }
    })
    contextMenu.append(playMenuItem);
    contextMenu.append(renameMenuItem);
    contextMenu.append(moveSongDirectory);
    contextMenu.append(songDelete);

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