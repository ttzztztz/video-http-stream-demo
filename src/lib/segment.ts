import { rangeBytesHeader } from "./headers";
import { parseSidx } from "./parse_sidx";
import { IPlayList, ISIDXData } from "./types";
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

export const handleSIDXSegment = async (
  video: HTMLVideoElement,
  mediaSource: MediaSource,
  sidxData: ISIDXData,
  type: "video" | "audio",
  buffer: SourceBuffer
) => {
  const initBuf = (await xhr(sidxData.resolvedUri, {
    responseType: "arraybuffer",
    headers: {
      Range: rangeBytesHeader(sidxData.byterange),
    },
  })) as ArrayBuffer;
  const initBufView = new Uint8Array(initBuf).subarray(8);
  const parsedSidx = parseSidx(initBufView) as any;
  console.log("parsed sidx", parsedSidx);

  for (
    let i = 0, last = sidxData.byterange.offset + sidxData.byterange.length;
    i < 5;
    i++
  ) {
    const chunkSize = parsedSidx.references[i].referencedSize;
    const currentBuf = (await xhr(sidxData.resolvedUri, {
      responseType: "arraybuffer",
      headers: {
        Range: rangeBytesHeader({
          offset: last,
          length: chunkSize,
        }),
      },
    })) as ArrayBuffer;
    last += chunkSize;

    buffer.appendBuffer(currentBuf);
    await waitBuffer(buffer);
  }
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
  if (playlist.sidx) {
    await handleSIDXSegment(video, mediaSource, playlist.sidx, type, buffer);
    return;
  }

  for (let i = 0; i < 5; i++) {
    const segment = playlist.segments[i];

    if (segment.map && !segment.map.bytes) {
      const initBuf = (await xhr(segment.map.resolvedUri, {
        responseType: "arraybuffer",
      })) as ArrayBuffer;
      segment.map.bytes = initBuf;
      buffer.appendBuffer(initBuf);
      await waitBuffer(buffer);
    }

    const currentBuf = (await xhr(segment.resolvedUri, {
      responseType: "arraybuffer",
    })) as ArrayBuffer;
    const res = currentBuf;
    buffer.appendBuffer(res);
    await waitBuffer(buffer);
  }
};
