const _glob = require("glob");

const glob = (pattern, options) => {
  return new Promise((resolve, reject) => {
    _glob(pattern, options, (err, paths) => {
      if (err) reject(err);
      else resolve(paths || []);
    });
  });
};

module.exports = { glob };
