import { IContentProtection, IPlayList } from "./types";
// import { bandwidth } from "./xhr";

// An example playlist select algorithm
export const selectVideoManifest = (playlists: IPlayList[]): IPlayList => {
  let selected = playlists[0];

  // const currentBandwidth = bandwidth;
  // for (const playlist of playlists) {
  //   if (
  //     selected.attributes.BANDWIDTH > playlist.attributes.BANDWIDTH &&
  //     currentBandwidth <= playlist.attributes.BANDWIDTH * 1.2
  //   ) {
  //     selected = playlist;
  //   }

  //   if (
  //     currentBandwidth > playlist.attributes.BANDWIDTH * 1.2 &&
  //     Math.abs(playlist.attributes.BANDWIDTH - currentBandwidth) <
  //       Math.abs(selected.attributes.BANDWIDTH - currentBandwidth)
  //   ) {
  //     selected = playlist;
  //   }
  // }
  return selected;
};

// A fake audio-select algorithm
export const selectAudioManifest = (
  playlists: undefined | { [key: string]: { playlists: IPlayList[] } }
): IPlayList | undefined => {
  const _playlists = playlists ?? {};
  for (const key of Object.keys(_playlists)) {
    return _playlists[key].playlists[0];
  }
  return undefined;
};

// A fake EME select algorithm
export const selectKeySystem = (contentProtection: IContentProtection) => {
  let lastKey = "";
  for (const key of Object.keys(contentProtection)) {
    if (key.includes("widevine")) {
      return key;
    }

    lastKey = key;
  }
  return lastKey;
};
