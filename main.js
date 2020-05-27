/*
    debug reading a folder to get music names - WIP RN
    Read folders in folders
    push to a queue to display on a screen on left hand side of screen
    Read string and split on Author and song name, read tag to see when was downloaded
*/

const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu, dialog} = electron;

let mainWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol:'file:',
        slashes: true
    }));

    const indexMenu = Menu.buildFromTemplate(indexMenuTemplate);
    Menu.setApplicationMenu(indexMenu);
});

// Menu template

const indexMenuTemplate = [
    {
        label: 'Folder',
        submenu: [
            {
                label: 'Select Folder',
                click() {
                    dialog.showOpenDialog({
                        properties: ['openDirectory'],
                        filters: [{
                            name: 'Audio', extensions: ['mp3']
                        }]
                    })
                    .then(result => {
                        console.log(result.filePaths);
                        let loadedSongs = [];

                        fs.readdir(result.filePaths.toString(), function(err, files) {
                            if (err) {
                                return console.log('Reading directory ERROR: ' + err);
                            }
                            files.forEach(function(file) {
                                if (file.endsWith('.mp3')) {
                                    loadedSongs.push(file);        
                                }
                            });
                            return loadedSongs;
                        });
                    })
                    .catch(err => {
                        console.log("Error occurred: " +err);
                    })
                }
            },
            {
                label: 'label placeholder'
            }
        ]
    }
];