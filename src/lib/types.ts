export interface ISegment {
  number: string;
  resolvedUri: string;
  timeline: number;
  uri: string;
  duration: number;
  map: {
    resolvedUri: string;
    uri: string;
    bytes: undefined | Uint8Array;
  };
}

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
}
