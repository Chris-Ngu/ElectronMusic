# Electron Music Utility
## Preface
* This project is to help mitigate the headaches that I currently run into by trying to manage all my song files.
* Mainly, this pertains to editing the song name and moving them into the correct folder for playlist detection
* I am currently using this foundation to understand electron and how web-based technologies are used to create cross-platform desktop applications. 
* Please bear with me as this application provides basic abilities, this might be expanded in the future


### Main features to work on
* Launching up application -> clicking button = nothing is working. Window needs to be active to work for some reason
* buttonLoad.js -> FILE IS UNMAINTAINABLE IF IT GROWS TOO LARGE, filling song div has three seperate copies. Need to clean and combine into one single function
* Delete button doesn't have confirmation, VERY DANGEROUS (• ε •)

### Song moving issue
* initialLoad implementation will refresh the older cached information (might need to fetch and update new information once a song has been moved over/ renamed)

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
* Need to clean up code, some of this is awfully prototyped and never finalized :/

### Images
![image](https://user-images.githubusercontent.com/57853013/103100641-266f9a00-45d9-11eb-881b-88d820ca8dc1.png)
