import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import { Song, SOURCE, DESTINATION } from "./types";

import "./styles/pages/Homepage.css";

const Homepage = () => {
  const [sourceAudioFiles, setSourceAudioFiles] = useState(1);
  const [sourceDirectory, setSourceDirectory] = useState("SourcePlaceholder");
  const [sourceDirectoryArray, setSourceDirectoryArray] = useState<Song[]>([
    { name: "someSongName1", path: "somePath", id: 3 },
  ]);

  const [destinationAudioFiles, setDestinationAudioFiles] = useState(1);
  const [destinationDirectory, setDestinationDirectory] = useState("DestinationPlaceholder");
  const [destinationDirectoryArray, setDestinationDirectoryArray] = useState<Song[]>([
    { name: "someSongName2", path: "somePath2", id: 1 }
  ]);

  // offset for destination ids
  const idOffset = 100000;

  const onDrop = (e: any, location: string) => {
    let id = parseInt(e.dataTransfer.getData("id"));

    if (location === "Source") {
      // destination => source
      for (let i = 0; i < destinationDirectoryArray.length; i++) {
        if (destinationDirectoryArray[i].id === id) {
          const obj: Song = {
            id: destinationDirectoryArray[i].id,
            path: destinationDirectoryArray[i].path,
            name: destinationDirectoryArray[i].name
          };

          setSourceDirectoryArray([...sourceDirectoryArray, obj]);
          setSourceAudioFiles(sourceAudioFiles + 1);
          setDestinationDirectoryArray(destinationDirectoryArray.filter((item) => item.id !== id))
          setDestinationAudioFiles(destinationAudioFiles - 1);
          break;
        }
      }
    }
    else if (location === "Destination") {
      // Dropping into destination
      for (let i = 0; i < sourceDirectoryArray.length; i++) {
        if (sourceDirectoryArray[i].id === id) {
          const obj = {
            id: sourceDirectoryArray[i].id,
            path: sourceDirectoryArray[i].path,
            name: sourceDirectoryArray[i].name
          };

          setDestinationDirectoryArray([...destinationDirectoryArray, obj]);
          setDestinationAudioFiles(destinationAudioFiles + 1);
          setSourceDirectoryArray(sourceDirectoryArray.filter((item) => item.id !== id))
          setSourceAudioFiles(sourceAudioFiles - 1);
          break;
        }

      }
    }
  }

  const DirectoryLoad = (location: string) => {
    if (location === SOURCE) {
      // call ipc for source songs
    }
    if (location === DESTINATION) {
      // call ipc for destination songs
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
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={(e) => onDrop(e, SOURCE)}
          >
            {
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
            }
          </div>
          <Button variant="primary" onClick={() => DirectoryLoad(SOURCE)}>Select Source Directory</Button>
        </div>

        <div id="right-box">
          <p>Audio files here: {destinationAudioFiles}</p>
          <p>Destination directory: {destinationDirectory}</p>
          <div
            className="song-container droppable"
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={(e) => onDrop(e, DESTINATION)}
          >
            {
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
            }
          </div>
          <Button variant="primary" onClick={() => DirectoryLoad(DESTINATION)}>Select Destination Directory</Button>
        </div>
      </div>
    </div >
  );
}

export default Homepage;