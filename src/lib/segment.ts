import { IPlayList } from "./types";
import { xhr } from "./xhr";

const { getMimeForCodec } = require("./codec");

export const handleSegment = async (
  mediaSource: MediaSource,
  playlist: IPlayList
) => {
  const mime = getMimeForCodec(playlist.attributes.CODECS);
  console.log(mime);
  const buffer = mediaSource.addSourceBuffer(mime);

  for (let i = 0; i < 5; i++) {
    const segment = playlist.segments[i];

    if (segment.map && !segment.map.bytes) {
      const initRes = (await xhr(segment.map.resolvedUri)) as any;
      const initBuf = new Uint8Array(initRes);
      segment.map.bytes = initBuf;
      buffer.appendBuffer(initBuf);
      console.log("append initial");
    }
    const res = (await xhr(segment.resolvedUri)) as any;
    buffer.appendBuffer(new Uint8Array(res));
    console.log("append ", i);
  }
};
