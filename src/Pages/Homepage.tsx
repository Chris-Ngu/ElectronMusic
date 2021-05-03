import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Song, SOURCE, DESTINATION, OPENFILEDIALOGERROR, OpenDialog } from "../types";
import SongListing from "../Components/SongListing";
import "../styles/pages/Homepage.css";

const ipcRenderer = window.require("electron").ipcRenderer;
const Homepage = () => {
  const [sourceAudioFiles, setSourceAudioFiles] = useState(0);
  const [sourceDirectory, setSourceDirectory] = useState("SourcePlaceholder");
  const [sourceDirectoryArray, setSourceDirectoryArray] = useState<typeof SongListing[]>();

  const [destinationAudioFiles, setDestinationAudioFiles] = useState(0);
  const [destinationDirectory, setDestinationDirectory] = useState("DestinationPlaceholder");
  const [destinationDirectoryArray, setDestinationDirectoryArray] = useState<typeof SongListing[]>();

  // const onDrop = (e: any, location: string) => {
  //   let id = parseInt(e.dataTransfer.getData("id"));

  //   if (location === SOURCE) {
  //     // destination => source
  //     for (let i = 0; i < destinationDirectoryArray.length; i++) {
  //       if (destinationDirectoryArray[i].id === id) {
  //         const obj: Song = {
  //           id: destinationDirectoryArray[i].id,
  //           path: destinationDirectoryArray[i].path,
  //           name: destinationDirectoryArray[i].name
  //         };

  //         setSourceDirectoryArray([...sourceDirectoryArray, obj]);
  //         setSourceAudioFiles(sourceAudioFiles + 1);
  //         setDestinationDirectoryArray(destinationDirectoryArray.filter((item) => item.id !== id))
  //         setDestinationAudioFiles(destinationAudioFiles - 1);
  //         break;
  //       }
  //     }
  //   }
  //   else if (location === DESTINATION) {
  //     // Dropping into destination
  //     for (let i = 0; i < sourceDirectoryArray.length; i++) {
  //       if (sourceDirectoryArray[i].id === id) {
  //         const obj = {
  //           id: sourceDirectoryArray[i].id,
  //           path: sourceDirectoryArray[i].path,
  //           name: sourceDirectoryArray[i].name
  //         };

  //         setDestinationDirectoryArray([...destinationDirectoryArray, obj]);
  //         setDestinationAudioFiles(destinationAudioFiles + 1);
  //         setSourceDirectoryArray(sourceDirectoryArray.filter((item) => item.id !== id))
  //         setSourceAudioFiles(sourceAudioFiles - 1);
  //         break;
  //       }

  //     }
  //   }
  //   else alert("ERROR");
  // }

  const DirectoryLoad = (location: string) => {
    const response: OpenDialog = ipcRenderer.sendSync("open-file-dialog");
    if (response.error) {
      return console.log(response.error);
    }
    refreshSongs(location, response.files!.length, response.path!);
  }

  const refreshSongs = (location: string, songNumber: number, path: string) => {
    if (location === SOURCE) {
      setSourceAudioFiles(songNumber);
      setSourceDirectory(path);
    }
    else {
      setDestinationAudioFiles(songNumber);
      setDestinationDirectory(path);
    }
  }

  return (
    <div id="body">
      <div id="music-player-container">
        <h5>Music Player Here</h5>
      </div>
      <div id="flex-container">
        <div id="tablet-nav">
          left tablet nav
        </div>
        <div id="left-box">
          <p>Audio files here: {sourceAudioFiles}</p>
          <p>Source directory: {sourceDirectory}</p>
          <div
            className="song-container droppable"
          // onDragOver={(e) => { e.preventDefault() }}
          // onDrop={(e) => onDrop(e, SOURCE)}
          >
            {/* {
              sourceDirectoryArray.map((item, i) => {
                return (
                  <div
                    className="draggable"
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("id", (item.id).toString())}
                  >
                    <h4>
                      {item.name}
                    </h4>
                  </div>
                )
              })
            } */}
          </div>
          <Button variant="primary" onClick={() => DirectoryLoad(SOURCE)}>Select Source Directory</Button>
        </div>

        <div id="right-box">
          <p>Audio files here: {destinationAudioFiles}</p>
          <p>Destination directory: {destinationDirectory}</p>
          <div
            className="song-container droppable"
          // onDragOver={(e) => { e.preventDefault() }}
          // onDrop={(e) => onDrop(e, DESTINATION)}
          >
            {/* {
              destinationDirectoryArray.map((item) => {
                return (
                  <div
                    className="draggable"
                    key={item.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("id", (item.id).toString())}
                  >
                    <h4>
                      {item.name}
                    </h4>
                  </div>
                )
              })
            } */}
          </div>
          <Button variant="primary" onClick={() => DirectoryLoad(DESTINATION)}>Select Destination Directory</Button>
        </div>
      </div>
    </div >
  );
}

export default Homepage;