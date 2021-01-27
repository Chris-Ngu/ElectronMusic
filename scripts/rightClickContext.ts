import { rightClick } from "../types/types";
// const { getCurrentWebContents, Menu, MenuItem } = require("electron").remote;
const { remote } = require("electron");

let webContents = remote.getCurrentWebContents();
let rightClickPosition: rightClick;

const contextMenu = new remote.Menu();
const menuItem = new remote.MenuItem({
    label: "Inspect element",
    click: () => {
        webContents.inspectElement(rightClickPosition.x, rightClickPosition.y);
    }
});

contextMenu.append(menuItem);

webContents.on("context-menu", (_, args: any) => {
    rightClickPosition = { x: args.x, y: args.y };
    contextMenu.popup({
        window: remote.getCurrentWindow()
    });
});