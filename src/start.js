//https://dev.to/jsmanifest/create-your-first-react-desktop-application-in-electron-with-hot-reload-4jj5
//Need mainWindow.on('closed') and 


const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

const { app, BrowserWindow, Menu, dialog } = electron;

let mainWindow;
let addWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({ 
        width: 318, height: 500, 
        resizable: false, 
        frame: false,
        webPreferences: { 
            nodeIntegration: true 
        } 
    });
    
    mainWindow.loadURL(
        isDev
        ? 'http://localhost:3000'
        : url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );
    //Original in case something messes up
    /*mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    })); */
    const indexMenu = Menu.buildFromTemplate(indexMenuTemplate);
    Menu.setApplicationMenu(indexMenu);
});



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
        click() {
            /*
                Show my contact information (github + linkedin)
                Show repository
            */
            createAddWindow();
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

const createAddWindow = () => {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'About'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'screens/about.html'),
        protocol: 'file:',
        slashes: true
    }));

}