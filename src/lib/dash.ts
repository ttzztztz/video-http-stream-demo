import { getMimeForCodec } from "./codec";
import { handleSegment } from "./segment";
import {
  selectVideoManifest,
  selectAudioManifest,
  selectKeySystem,
} from "./select";
import { bandwidth, xhr } from "./xhr";

const mpdParser = require("mpd-parser");

export const dashHandler = async (
  video: HTMLVideoElement,
  mediaSource: MediaSource,
  mpdSrc: string
) => {
  video.addEventListener("encrypted", (e) => {
    console.warn(e);
  });

  const file = await xhr(mpdSrc);
  const manifest = await mpdParser.parse(file, {
    manifestUri: mpdSrc,
  });
  const selectedVideoManifest = selectVideoManifest(manifest.playlists);
  const selectedAudioManifest = selectAudioManifest(
    manifest.mediaGroups?.AUDIO?.audio
  );
  console.log(
    "selected",
    bandwidth,
    selectedVideoManifest,
    manifest,
    selectedAudioManifest
  );

  if (selectedVideoManifest.contentProtection) {
    const key = selectKeySystem(selectedVideoManifest.contentProtection);
    const keyAccess = await navigator.requestMediaKeySystemAccess(key, [
      {
        videoCapabilities: [
          {
            contentType: getMimeForCodec(
              selectedVideoManifest.attributes.CODECS
            ),
          },
        ],
        audioCapabilities: [
          {
            contentType: getMimeForCodec(
              selectedAudioManifest?.attributes.CODECS
            ),
          },
        ],
      },
    ]);
    const mediaKeys = await keyAccess.createMediaKeys();
    await video.setMediaKeys(mediaKeys);
  }

  if (selectedVideoManifest) {
    handleSegment(video, mediaSource, selectedVideoManifest, "video");
  }
  if (selectedAudioManifest) {
    handleSegment(video, mediaSource, selectedAudioManifest, "audio");
  }
};
