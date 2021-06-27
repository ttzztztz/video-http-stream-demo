import React, { useEffect } from "react";
import "./App.css";
import { dashHandler } from "./lib/dash";

// DASH
// const MPD_SRC = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

// DRM
// const MPD_SRC =
//   "https://media.axprod.net/TestVectors/v7-MultiDRM-SingleKey/Manifest.mpd";

// SIDX
const MPD_SRC =
  "https://dash.akamaized.net/dash264/TestCases/10a/1/iis_forest_short_poem_multi_lang_480p_single_adapt_aaclc_sidx.mpd";

function App() {
  useEffect(() => {
    const el = document.querySelector("#video") as HTMLVideoElement;

    const mediaSource = new MediaSource();
    (window as any).mediaSorce = mediaSource;
    (window as any).v = el;

    el.src = URL.createObjectURL(mediaSource);

    console.log("mediasource", mediaSource);
    mediaSource.addEventListener("sourceopen", () => {
      URL.revokeObjectURL(el.src);
      dashHandler(el, mediaSource, MPD_SRC);
    });
  });

  return (
    <div className="App">
      <video
        id="video"
        controls
        style={{ width: "600px", height: "400px" }}
      ></video>
    </div>
  );
}

export default App;
