export let bandwidth = 0;

// setInterval(() => {
//   console.warn(`${bandwidth / 1024.0} KB/s`);
// }, 1000);

export interface IXHRConfig {
  method?: string;
  body?: any;
  responseType?: XMLHttpRequestResponseType;
  headers?: Record<string, string>;
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
    if (config?.headers) {
      Object.entries(config?.headers).forEach(([k, v]) =>
        oReq.setRequestHeader(k, v)
      );
    }
    startTime = Date.now();
    oReq.send(config?.body);
  });
};
