# Electron Music Utility
## Preface
* This project is to help mitigate the headaches that I currently run into by trying to manage all my song files.
* Mainly, this pertains to editing the song name and moving them into the correct folder for playlist detection
* I am currently using this foundation to understand electron and how web-based technologies are used to create cross-platform desktop applications. 
* Please bear with me as this application provides basic abilities, this might be expanded in the future （πーπ）


### Main features to work on
* buttonLoad.js -> FILE IS UNMAINTAINABLE IF IT GROWS TOO LARGE, filling song div has three seperate copies. Need to clean and combine into one single function
* Add actions to history stack

### Song moving issue
* initialLoad implementation will refresh the older cached information (might need to fetch and update new information once a song has been moved over/ renamed)
* Changing song name -> clicking initialLoad will cause the program to refresh to older information. This will break stuff
* Could change button name to refresh and update cache based on file location rather than the cached object


### Future designs
* Port to Electron + React?
* I messed up bigtime by not using Typescript, might want to convert this over if I ever feel like iterating and cleaning up the redundant code
* Need to clean up code, some of this is awfully prototyped and never finalized :/

### Images
![image](https://user-images.githubusercontent.com/57853013/103965877-4b5d2480-5124-11eb-9ba9-05e35ff8b12d.png)
