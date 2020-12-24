const { ipcRenderer } = require("electron");

/**
 * SYNCHRONOUS FUNCTION
 * Listens for button click and calls IPCMain thread to ask for files
 * Appends list of songs to child button component
 */
document.getElementById("getFileButton").addEventListener("click", (event) => {
    const response = ipcRenderer.sendSync("open-file-dialog");

    // Error message received here
    if (response.length === 1) {
        document.getElementById("sourceFileLocation").innerHTML = response[0];
    }
    // No error message and have array of song lists
    else {
        document.getElementById("sourceFileLocation").innerHTML = response[0];
    }
});

document.getElementById("getDestinationFileButton").addEventListener("click", (event) => {
    const response = ipcRenderer.sendSync("open-file-dialog");

    // Error message received here
    if (response.length === 1) {
        document.getElementById("destinationFileLocation").innerHTML = response[0];
    }
    // No error message and have array of song lists
    else {
        document.getElementById("destinationFileLocation").innerHTML = response[0];
    }
});
