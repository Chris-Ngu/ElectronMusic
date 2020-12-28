const { getCurrentWebContents, Menu, MenuItem } = require("electron").remote;

let webContents = getCurrentWebContents();
let rightClickPosition;

const contextMenu = new Menu();
const menuItem = new MenuItem({
    label: "Inspect element",
    click: () => {
        webContents.inspectElement(rightClickPosition.x, rightClickPosition.y);
    }
});

contextMenu.append(menuItem);

webContents.on("context-menu", (event, args) => {
    rightClickPosition = { x: args.x, y: args.y };
    contextMenu.popup({
        window: remote.getCurrentWindow()
    });
});