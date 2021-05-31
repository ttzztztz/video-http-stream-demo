import { setupDRM } from "./drm";
import { handleSegment } from "./segment";
import { selectVideoManifest, selectAudioManifest } from "./select";
import { bandwidth, xhr } from "./xhr";

const mpdParser = require("mpd-parser");

const waitBuffer = (buffer: SourceBuffer) => {
  return new Promise<void>((res) => {
    const listener = () => {
      console.warn('buffeer updateend', buffer.buffered.length);
      buffer.removeEventListener("updateend", listener);
      res();
    };
    buffer.addEventListener("updateend", listener);
  });
};

export const dashHandler = async (
  video: HTMLVideoElement,
  mediaSource: MediaSource,
  mpdSrc: string
) => {
  video.addEventListener("encrypted", (e) => {
    console.warn('encrypted', e);
  });

  const mime = 'video/mp4; codecs="avc1.640020"'
  const buffer = mediaSource.addSourceBuffer(mime);
  for (let i = 0; i < 4; i++) {
    const currentReq = await fetch(`./fileSequence${i}.ts`);
    const res = await currentReq.arrayBuffer();
    buffer.appendBuffer(res);
    console.log('append buffer', i);
    await waitBuffer(buffer);
  }

  // const file = await xhr(mpdSrc);
  // const manifest = await mpdParser.parse(file, {
  //   manifestUri: mpdSrc,
  // });
  // const selectedVideoManifest = selectVideoManifest(manifest.playlists);
  // const selectedAudioManifest = selectAudioManifest(
  //   manifest.mediaGroups?.AUDIO?.audio
  // );
  // console.log(
  //   "selected",
  //   bandwidth,
  //   selectedVideoManifest,
  //   manifest,
  //   selectedAudioManifest
  // );

  // setupDRM(
  //   video,
  //   mediaSource,
  //   mpdSrc,
  //   selectedVideoManifest,
  //   selectedAudioManifest
  // );
  // if (selectedVideoManifest) {
  //   handleSegment(video, mediaSource, selectedVideoManifest, "video");
  // }
  // if (selectedAudioManifest) {
  //   handleSegment(video, mediaSource, selectedAudioManifest, "audio");
  // }
};
