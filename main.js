const electron = require('electron');
const url = require('url');
const path = require('path');

const fs = require('fs');

const {app, BrowserWindow} = electron;

let mainWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol:'file:',
        slashes: true
    }));
})