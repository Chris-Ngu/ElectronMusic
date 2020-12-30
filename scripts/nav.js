const remote = require("electron").remote;

document.getElementById("close-button").addEventListener("click", (e) => {
    const window = remote.getCurrentWindow();
    window.close();
});

document.getElementById("min-button").addEventListener("click", (e) => {
    const window = remote.getCurrentWindow();
    window.minimize();
})

// document.getElementById("close-button").addEventListener("click", (e) => {
//     window.close();
// })
