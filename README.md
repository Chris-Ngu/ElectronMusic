# Electron Music Utility
## Preface
* This project is to help mitigate the headaches that I currently run into by trying to manage all my song files.
* Mainly, this pertains to editing the song name and moving them into the correct folder for playlist detection
* I am currently using this foundation to understand electron and how web-based technologies are used to create cross-platform desktop applications. 
* Please bear with me as this application provides basic abilities, this might be expanded in the future


### Main features to work on
* Launching up application -> clicking button = nothing is working. Window needs to be active to work for some reason
* buttonLoad.js -> FILE IS UNMAINTAINABLE IF IT GROWS TOO LARGE, filling song div has three seperate copies. Need to clean and combine into one single function
* Handle moving files into non-existing directory (using fs.mkdir)

### Song moving issue
* Line 27, buttonLoad.js
* It's not being able to find the files because this is being binded to the button as I choose the source path, not being updated when destination path is being updated. This probably isn't an issue while selecting the second directory as the first p tag already has a value
* What I could do is select the destination paths, then have a button that loads them all (once destinationPath and sourcePath p tags have been identified);
* This will not affect the refresh function as the destinationPath and sourcePath p tags already have the paths.
* I need to do this for both the initial source/ destination divs as well as inside the refresh function (might not need as stated earlier, just a safety precaution)

 ### Song playback
 * ~~Include audio package to preview songs~~ Can include in the future

### Design
* Work on layout of application
* Handle new menu bar buttons (not working for some reason). Placeholder implementation in place for the time
 
### Right click/ song click menu
* RIGHT CLICK: Programatically detect what is being right clicked and dynamically build the MenuItems
* ref: https://stackoverflow.com/questions/47756822/change-electrons-menu-items-status-dynamically


### Future designs
* Port to Electron + React?
* I messed up bigtime by not using Typescript, might want to convert this over if I ever feel like iterating and cleaning up the redundant code

### Images
![image](https://user-images.githubusercontent.com/57853013/103100641-266f9a00-45d9-11eb-881b-88d820ca8dc1.png)
