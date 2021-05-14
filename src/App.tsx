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
    el.src = URL.createObjectURL(mediaSource);

    console.log("mediasource", mediaSource);
    mediaSource.addEventListener("sourceopen", async () => {
      // URL.revokeObjectURL(el.src);
      // dashHandler(el, mediaSource, MPD_SRC);

      const buffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.640020"');
      const abuffer = mediaSource.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');

      const initseg = await fetch('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/v5/main.mp4', {
        headers: {
          Range: 'bytes=0-718'
        }
      });
      const initseg_ab = await initseg.arrayBuffer();
      buffer.appendBuffer(initseg_ab);

      const seg1 = await fetch('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/v5/main.mp4', {
        headers: {
          Range: 'bytes=719-1508718'
        }
      });
      const seg1_ab = await seg1.arrayBuffer();
      buffer.appendBuffer(seg1_ab);


      const ainitseg = await fetch('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/a1/main.mp4', {
        headers: {
          Range: 'bytes=0-615'
        }
      });
      const ainitseg_ab = await ainitseg.arrayBuffer();
      abuffer.appendBuffer(ainitseg_ab);

      const aseg1 = await fetch('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/a1/main.mp4', {
        headers: {
          Range: 'bytes=616-121090'
        }
      });
      const aseg1_ab = await aseg1.arrayBuffer();
      abuffer.appendBuffer(aseg1_ab);
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
