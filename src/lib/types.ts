export interface IByteRange {
  length: number;
  offset: number;
}

export interface ISegmentMap {
  resolvedUri: string;
  uri: string;
  bytes: undefined | Uint8Array | ArrayBuffer;
  byterange?: IByteRange;
}

export interface ISegment {
  number: string;
  resolvedUri: string;
  timeline: number;
  uri: string;
  duration: number;
  map: ISegmentMap;
}

export interface ISIDXData {
  byterange: IByteRange;
  duration: number;
  map: ISegmentMap;
  number: number;
  resolvedUri: string;
  timeline: number;
  uri: string;
}

export type IContentProtection = Record<
  string,
  {
    attributes: { schemeIdUri: string; value: string };
    pssh: Uint8Array;
  }
>;

export interface IPlayList {
  attributes: {
    NAME: string;
    BANDWIDTH: number;
    CODECS: string;
    RESOLUTION: {
      height: number;
      width: number;
    };
  };
  segments: ISegment[];
  contentProtection?: IContentProtection;
  sidx?: ISIDXData;
}
