module.exports = function () {
  // api.cache(false);
  const presets = [
    [require("@babel/preset-typescript")],
    [require("@babel/preset-react")],
    [
      require("@babel/preset-env"),
      {
        corejs: { version: 3 },
        useBuiltIns: "usage",
        targets: {
          ie: "11",
        },
      },
    ],
  ];
  const plugins = [
    [
      require("@babel/plugin-proposal-decorators"),
      { decoratorsBeforeExport: true },
    ],
    [require("@babel/plugin-proposal-class-properties")],
    [require("@babel/plugin-transform-modules-commonjs")],
    [require("@babel/plugin-transform-arrow-functions")],
    [require("@babel/plugin-transform-object-assign")],
    [
      require("@babel/plugin-transform-runtime"),
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
