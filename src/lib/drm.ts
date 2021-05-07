import { ReactEventHandler } from "react";
import { selectKeySystem } from "./select";
import { getMimeForCodec } from "./codec";
import { IPlayList } from "./types";
import { xhr } from "./xhr";

export const handleMediaEncryptedEvent: ReactEventHandler<HTMLVideoElement> = (
  e
) => {
  console.warn(e);
};

const DRM_URL = `https://drm-widevine-licensing.axtest.net/AcquireLicense`;
const HEADERS = {
  "X-AxDRM-Message":
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoxLCJjb21fa2V5X2lkIjoiYjMzNjRlYjUtNTFmNi00YWUzLThjOTgtMzNjZWQ1ZTMxYzc4IiwibWVzc2FnZSI6eyJ0eXBlIjoiZW50aXRsZW1lbnRfbWVzc2FnZSIsImtleXMiOlt7ImlkIjoiOWViNDA1MGQtZTQ0Yi00ODAyLTkzMmUtMjdkNzUwODNlMjY2IiwiZW5jcnlwdGVkX2tleSI6ImxLM09qSExZVzI0Y3Iya3RSNzRmbnc9PSJ9XX19.4lWwW46k-oWcah8oN18LPj5OLS5ZU-_AQv7fe0JhNjA",
  "Content-type": "application/octet-stream",
};

const getLicence = async (data: ArrayBuffer) => {
  return (await xhr(DRM_URL, {
    responseType: "arraybuffer",
    method: "POST",
    body: data,
    headers: HEADERS,
  })) as ArrayBuffer;
};

export const setupDRM = async (
  video: HTMLVideoElement,
  mediaSource: MediaSource,
  mpdSrc: string,
  selectedVideoManifest: IPlayList,
  selectedAudioManifest?: IPlayList
) => {
  if (selectedVideoManifest.contentProtection) {
    const key = selectKeySystem(selectedVideoManifest.contentProtection);
    const keyAccess = await navigator.requestMediaKeySystemAccess(key, [
      {
        videoCapabilities: [
          {
            contentType: getMimeForCodec(
              selectedVideoManifest.attributes.CODECS
            ),
          },
        ],
        audioCapabilities: [
          {
            contentType: getMimeForCodec(
              selectedAudioManifest?.attributes.CODECS
            ),
          },
        ],
      },
    ]);
    const mediaKeys = await keyAccess.createMediaKeys();
    await video.setMediaKeys(mediaKeys);
    const session = mediaKeys.createSession();
    session.addEventListener("message", async (e) => {
      console.log("message event", e);
      const res = await getLicence(e.message);
      await session.update(res);
    });
    await session.generateRequest(
      "cenc",
      selectedVideoManifest.contentProtection["com.widevine.alpha"].pssh
    );
  }
};
