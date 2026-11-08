/*!
 * Générateur ZIP minimal (méthode "store", sans compression), 100 % navigateur.
 *   var z = MLS.zip(); z.add('index.html', '<html>…'); z.add('img.png', uint8array); z.blob();
 */
(function (MLS) {
  'use strict';

  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  var enc = new TextEncoder();

  function dosDateTime(d) {
    return {
      time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
      date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
    };
  }

  MLS.zip = function () {
    var files = [];
    return {
      add: function (path, data) {
        var bytes = typeof data === 'string' ? enc.encode(data) : new Uint8Array(data);
        files.push({ name: enc.encode(path.replace(/^\/+/, '')), path: path, data: bytes, crc: crc32(bytes) });
      },
      paths: function () { return files.map(function (f) { return f.path; }); },
      blob: function () {
        var dt = dosDateTime(new Date());
        var chunks = [], central = [], offset = 0;
        files.forEach(function (f) {
          var h = new DataView(new ArrayBuffer(30));
          h.setUint32(0, 0x04034b50, true);
          h.setUint16(4, 20, true);
          h.setUint16(6, 0x0800, true);        // noms en UTF-8
          h.setUint16(8, 0, true);             // store
          h.setUint16(10, dt.time, true);
          h.setUint16(12, dt.date, true);
          h.setUint32(14, f.crc, true);
          h.setUint32(18, f.data.length, true);
          h.setUint32(22, f.data.length, true);
          h.setUint16(26, f.name.length, true);
          h.setUint16(28, 0, true);
          chunks.push(h.buffer, f.name, f.data);

          var c = new DataView(new ArrayBuffer(46));
          c.setUint32(0, 0x02014b50, true);
          c.setUint16(4, 20, true);
          c.setUint16(6, 20, true);
          c.setUint16(8, 0x0800, true);
          c.setUint16(10, 0, true);
          c.setUint16(12, dt.time, true);
          c.setUint16(14, dt.date, true);
          c.setUint32(16, f.crc, true);
          c.setUint32(20, f.data.length, true);
          c.setUint32(24, f.data.length, true);
          c.setUint16(28, f.name.length, true);
          c.setUint32(42, offset, true);
          central.push(c.buffer, f.name);
          offset += 30 + f.name.length + f.data.length;
        });
        var cdSize = central.reduce(function (s, b) { return s + (b.byteLength != null ? b.byteLength : b.length); }, 0);
        var e = new DataView(new ArrayBuffer(22));
        e.setUint32(0, 0x06054b50, true);
        e.setUint16(8, files.length, true);
        e.setUint16(10, files.length, true);
        e.setUint32(12, cdSize, true);
        e.setUint32(16, offset, true);
        return new Blob(chunks.concat(central, [e.buffer]), { type: 'application/zip' });
      }
    };
  };
})(window.MLS);
