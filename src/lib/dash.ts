import { handleSegment } from "./segment";
import { selectManifest } from "./select";
import { bandwidth, xhr } from "./xhr";

const mpdParser = require("mpd-parser");

export const dashHandler = async (mediaSource: MediaSource, mpdSrc: string) => {
  const file = await xhr(mpdSrc);
  const manifest = await mpdParser.parse(file, {
    manifestUri: mpdSrc
  });
  const selectedManifest = selectManifest(manifest.playlists);

  console.log("selected", bandwidth, selectedManifest, manifest);
  handleSegment(mediaSource, selectedManifest);
};
