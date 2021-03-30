const fs = require("fs");
const archiver = require("archiver");
const glob = require("glob");

module.exports = {
  /**
   * @param {String} source
   * @param {String} out
   * @returns {Promise}
   */
  zipDir: (source, out) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on("error", (error) => reject(error))
        .pipe(stream);
      stream.on("close", () => resolve());
      archive.finalize();
    });
  },
};
