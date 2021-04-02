const fs = require("fs");
const archiver = require("archiver");

/**
 * @param {string} source
 * @param {String} out
 * @param {Object} [options]
 * @returns {Promise}
 */
const archive = (pattern, out, options) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .glob(pattern, options)
      .on("error", (error) => reject(error))
      .pipe(stream);
    stream.on("close", () => resolve());
    archive.finalize();
  });
};

module.exports = { archive };
