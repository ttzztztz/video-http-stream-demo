import { IByteRange } from "./types";

export const rangeBytesHeader = (byterange: IByteRange) => {
  return `bytes=${byterange.offset}-${byterange.offset + byterange.length - 1}`;
};
