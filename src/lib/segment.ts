import { selectKeySystem } from "./select";
import { IPlayList } from "./types";
import { xhr } from "./xhr";

const { getMimeForCodec } = require("./codec");

const waitBuffer = (buffer: SourceBuffer) => {
  return new Promise<void>((res) => {
    const listener = () => {
      res();
      buffer.removeEventListener("updateend", listener);
    };
    buffer.addEventListener("updateend", listener);
  });
};

export const handleSegment = async (
  video: HTMLVideoElement,
  mediaSource: MediaSource,
  playlist: IPlayList,
  type: "video" | "audio"
) => {
  const mime = getMimeForCodec(playlist.attributes.CODECS);
  console.log(mime);

  const buffer = mediaSource.addSourceBuffer(mime);

  for (let i = 0; i < 5; i++) {
    const segment = playlist.segments[i];

    if (segment.map && !segment.map.bytes) {
      const initBuf = (await xhr(segment.map.resolvedUri, {
        responseType: "arraybuffer",
      })) as any;
      segment.map.bytes = initBuf;
      buffer.appendBuffer(initBuf);
      await waitBuffer(buffer);
    }

    const currentBuf = (await xhr(segment.resolvedUri, {
      responseType: "arraybuffer",
    })) as any;
    const res = currentBuf;
    buffer.appendBuffer(res);
    await waitBuffer(buffer);
  }
};
