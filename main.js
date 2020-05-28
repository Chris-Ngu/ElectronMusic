/*
    debug reading a folder to get music names - WIP RN
    Read folders in folders
    load folder locations with folder option
    push to a queue to display on a screen on left hand side of screen
    Read string and split on Author and song name, read tag to see when was downloaded
*/

const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, Menu, dialog } = electron;

let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
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
                    selectFolder();
                }
            }
        ]
    },
    {
        label: 'Preferences',
        click() {
            /*
                Discord integration
                Theme
                Player size
                bug report
            */
        }
    },
    {
        label: 'Info',
        click () {
            /*
                Show my contact information (github + linkedin)
                Show repository
            */
        }
    }
];

const selectFolder = () => {
    //Will need to redo this into an object (key:value);
    //Will load songs by string concatination (result.filePaths.toString() + "\\" + SONGNAMEHERE);
    let loadedSongs = [];

    dialog.showOpenDialog({
        properties: ['openDirectory'],
        filters: [{
            name: 'Audio', extensions: ['mp3']
        }]
    })
        .then(result => {
            //console.log(result.filePaths);

            fs.readdir(result.filePaths.toString(), function (err, files) {
                if (err) {
                    return console.log('Reading directory ERROR: ' + err);
                }
                else {
                    files.forEach(function (file) {
                        if (file.endsWith('.mp3')) {
                            loadedSongs.push(file);
                        }
                    });
                    
                    /*
                        Handle files here
                    */
                   for (files in loadedSongs) {
                       console.log(loadedSongs[files]);
                   }
                }
            });
        })
        .catch(err => {
            console.log("Error occurred: " + err);
        });

}