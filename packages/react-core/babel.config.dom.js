import styleXBabelPlugin from "@stylexjs/babel-plugin";

module.exports = function () {
  return {
    plugins: [
      styleXBabelPlugin({
        importSources: [{ from: "react-strict-dom", as: "css " }],
      }),
    ],
  };
};
