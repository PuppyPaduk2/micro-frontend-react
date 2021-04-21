const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { baseHooks } = require("./base-hooks");
const build = require("./build");

module.exports = build(baseHooks);
