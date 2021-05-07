import { setupDRM } from "./drm";
import { handleSegment } from "./segment";
import { selectVideoManifest, selectAudioManifest } from "./select";
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

  setupDRM(
    video,
    mediaSource,
    mpdSrc,
    selectedVideoManifest,
    selectedAudioManifest
  );
  if (selectedVideoManifest) {
    handleSegment(video, mediaSource, selectedVideoManifest, "video");
  }
  if (selectedAudioManifest) {
    handleSegment(video, mediaSource, selectedAudioManifest, "audio");
  }
};
