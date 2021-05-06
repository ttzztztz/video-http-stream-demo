import { IXHRConfig } from "./types";

export let bandwidth = 0;

export const xhr = (url: string, config?: IXHRConfig) => {
  let lastTime = 0,
    lastLoaded = 0;
  return new Promise((res) => {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        res(oReq.response);
      }
    };
    oReq.onprogress = function (e) {
      bandwidth = 1000.0 * ((e.loaded - lastLoaded) / (Date.now() - lastTime));
      lastLoaded = e.loaded;
      lastTime = Date.now();
    };

    oReq.open(config?.method ?? "GET", url);
    lastTime = Date.now();
    oReq.send(config?.body);
  });
};
