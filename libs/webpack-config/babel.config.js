module.exports = function (api) {
  api.cache(false);
  const presets = [
    [require.resolve("@babel/preset-typescript")],
    [require.resolve("@babel/preset-react")],
    [
      require.resolve("@babel/preset-env"),
      { corejs: { version: 3 }, useBuiltIns: "usage", targets: { ie: "11" } },
    ],
  ];
  const plugins = [
    [
      require.resolve("@babel/plugin-proposal-decorators"),
      { decoratorsBeforeExport: true },
    ],
    [require.resolve("@babel/plugin-proposal-class-properties")],
    [require.resolve("@babel/plugin-transform-modules-commonjs")],
    [require.resolve("@babel/plugin-transform-arrow-functions")],
    [require.resolve("@babel/plugin-transform-object-assign")],
    [
      require.resolve("@babel/plugin-transform-runtime"),
      { useESModules: false, regenerator: true },
    ],
  ];
  return {
    presets,
    plugins,
    ignore: [
      /node_modules\/(?!(color-convert|ansi-styles|strip-ansi|ansi-regex|debug|react-dev-utils|chalk|acorn-jsx|punycode)\/).*/,
      /[\/\\]core-js/,
      /@babel[\/\\]runtime/,
    ],
  };
};
