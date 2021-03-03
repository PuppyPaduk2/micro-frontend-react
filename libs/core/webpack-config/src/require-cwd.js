/**
 * Require module with path 'process.cwd()'
 * @param {string} name
 */
function requireCwd(name) {
  return require(require.resolve(name, { paths: [process.cwd()] }));
}

module.exports = { requireCwd };
