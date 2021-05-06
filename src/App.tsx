import React, { useEffect } from "react";
import "./App.css";
import { dashHandler } from "./lib/dash";

const MPD_SRC = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

function App() {
  useEffect(() => {
    const el = document.querySelector("#video") as HTMLVideoElement;
    const mediaSource = new MediaSource();
    el.src = URL.createObjectURL(mediaSource);

    dashHandler(mediaSource, MPD_SRC);
  });

  return (
    <div className="App">
      <video
        id="video"
        controls
        style={{ width: "100%", height: "100%" }}
      ></video>
    </div>
  );
}

export default App;
