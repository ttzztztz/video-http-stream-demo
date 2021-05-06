import { IPlayList } from "./types";
import { bandwidth } from "./xhr";

// An example playlist select algorithm
export const selectManifest = (playlists: IPlayList[]): IPlayList => {
  let selected = playlists[0];

  const currentBandwidth = bandwidth;
  for (const playlist of playlists) {
    if (
      selected.attributes.BANDWIDTH > playlist.attributes.BANDWIDTH &&
      currentBandwidth <= playlist.attributes.BANDWIDTH * 1.2
    ) {
      selected = playlist;
    }

    if (
      currentBandwidth > playlist.attributes.BANDWIDTH * 1.2 &&
      Math.abs(playlist.attributes.BANDWIDTH - currentBandwidth) <
        Math.abs(selected.attributes.BANDWIDTH - currentBandwidth)
    ) {
      selected = playlist;
    }
  }
  return selected;
};
