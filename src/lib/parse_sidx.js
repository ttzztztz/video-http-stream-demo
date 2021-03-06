// This file is copied from video.js project
var MAX_UINT32 = Math.pow(2, 32);

export var parseSidx = function (data) {
  var view = new DataView(data.buffer, data.byteOffset, data.byteLength),
    result = {
      version: data[0],
      flags: new Uint8Array(data.subarray(1, 4)),
      references: [],
      referenceId: view.getUint32(4),
      timescale: view.getUint32(8),
    },
    i = 12;

  if (result.version === 0) {
    result.earliestPresentationTime = view.getUint32(i);
    result.firstOffset = view.getUint32(i + 4);
    i += 8;
  } else {
    // read 64 bits
    result.earliestPresentationTime =
      view.getUint32(i) * MAX_UINT32 + view.getUint32(i + 4);
    result.firstOffset =
      view.getUint32(i + 8) * MAX_UINT32 + view.getUint32(i + 12);
    i += 16;
  }

  i += 2; // reserved

  var referenceCount = view.getUint16(i);

  i += 2; // start of references

  for (; referenceCount > 0; i += 12, referenceCount--) {
    result.references.push({
      referenceType: (data[i] & 0x80) >>> 7,
      referencedSize: view.getUint32(i) & 0x7fffffff,
      subsegmentDuration: view.getUint32(i + 4),
      startsWithSap: !!(data[i + 8] & 0x80),
      sapType: (data[i + 8] & 0x70) >>> 4,
      sapDeltaTime: view.getUint32(i + 8) & 0x0fffffff,
    });
  }

  return result;
};
