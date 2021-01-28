"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const { getCurrentWebContents, Menu, MenuItem } = require("electron").remote;
var remote = require("electron").remote;
var webContents = remote.getCurrentWebContents();
var rightClickPosition;
var contextMenu = new remote.Menu();
var menuItem = new remote.MenuItem({
    label: "Inspect element",
    click: function () {
        webContents.inspectElement(rightClickPosition.x, rightClickPosition.y);
    }
});
contextMenu.append(menuItem);
webContents.on("context-menu", function (_, args) {
    rightClickPosition = { x: args.x, y: args.y };
    contextMenu.popup({
        window: remote.getCurrentWindow()
    });
});
//# sourceMappingURL=rightClickContext.js.map