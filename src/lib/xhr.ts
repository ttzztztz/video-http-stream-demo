export let bandwidth = 0;

// setInterval(() => {
//   console.warn(`${bandwidth / 1024.0} KB/s`);
// }, 1000);

export interface IXHRConfig {
  method?: string;
  body?: any;
  responseType?: XMLHttpRequestResponseType;
}

export const xhr = (url: string, config?: IXHRConfig) => {
  let startTime = 0;
  return new Promise((res) => {
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        res(oReq.response);
      }
    };

    if (config?.responseType) {
      oReq.responseType = config?.responseType;
    }
    oReq.onprogress = function (e) {
      if (e.loaded > 0) {
        bandwidth = 1000.0 * (e.loaded / (Date.now() - startTime));
      }
    };

    oReq.open(config?.method ?? "GET", url);
    startTime = Date.now();
    oReq.send(config?.body);
  });
};
