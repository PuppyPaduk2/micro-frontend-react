const $glob = require("glob");

const search = (pattern, options) =>
  new Promise((resolve, reject) => {
    $glob(pattern, options, (err, paths) => {
      if (err) reject(err);
      else resolve(paths);
    });
  });

module.exports = { search };
