import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import "./styles/pages/Homepage.css";

const Homepage = () => {
  const [sourceAudioFiles, setSourceAudioFiles] = useState(0);
  const [sourceDirectory, setSourceDirectory] = useState("SourcePlaceholder");
  const [sourceDirectoryArray, setSourceDirectoryArray] = useState([
    { name: "learn angular" },
    { name: "React" }
  ]);

  const [destinationAudioFiles, setDestinationFiiles] = useState(9);
  const [destinationDirectory, setDestinationDirectory] = useState("DestinationPlaceholder");
  const [destinationDirectoryArray, setDestinationDirectoryArray] = useState([
    { name: "something" }
  ]);

  const onDrop = (e: any, location: string) => {
    let id = e.dataTransfer.getData("id");

    if (location === "Source") {
      // Remove from Source Array
      // Push to Destination Array
      let index = sourceDirectoryArray.indexOf(id);

      setSourceDirectoryArray([...sourceDirectoryArray.splice(index, 1), { name: id }]);
      // sourceDirectoryArray.splice(index, 1);
      setDestinationDirectoryArray([...destinationDirectoryArray, { name: id }]);
      // destinationDirectoryArray.push({
      //   name: id
      // });
    }
    else if (location === "Destination") {
      let index = destinationDirectoryArray.indexOf(id);
      setDestinationDirectoryArray([...destinationDirectoryArray.splice(index, 1), { name: id }]);

      // destinationDirectoryArray.splice(index, 1);
      setSourceDirectoryArray([...sourceDirectoryArray, { name: id }]);
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
            onDrop={(e) => onDrop(e, "Source")}
          >
            {
              sourceDirectoryArray.map((item) => {
                return (
                  <div
                    className="draggable"
                    key={item.name}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("id", item.name)}
                  >
                    <h4>
                      {item.name}
                    </h4>
                  </div>
                )
              })
            }
          </div>
          <Button variant="primary">Select Source Directory</Button>
        </div>
        <div id="right-box">
          <p>Audio files here: {destinationAudioFiles}</p>
          <p>Destination directory: {destinationDirectory}</p>
          <div
            className="song-container droppable"
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={(e) => onDrop(e, "Destination")}

          >
            {
              destinationDirectoryArray.map((item) => {
                return (
                  <div
                    className="draggable"
                    key={item.name}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("id", item.name)}
                  >
                    <h4>
                      {item.name}
                    </h4>
                  </div>
                )
              })
            }
          </div>
          <Button variant="primary">Select Destination Directory</Button>
        </div>
      </div>
    </div >
  );
}

export default Homepage;
