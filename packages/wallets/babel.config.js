/* eslint-disable */
const fs = require("fs");

const packageJson = JSON.parse(
  fs.readFileSync("./package.json", { encoding: "utf8" }),
);

module.exports = {
  presets: [
    "@babel/preset-typescript",
    ["@babel/preset-env", { targets: "defaults, not ie 11" }],
  ],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-proposal-class-properties",
    [
      "minify-replace",
      {
        replacements: [
          {
            identifierName: "__PACKAGE_VERSION__",
            replacement: {
              type: "stringLiteral",
              value: packageJson.version,
            },
          },
          {
            identifierName: "__PACKAGE_NAME__",
            replacement: {
              type: "stringLiteral",
              value: packageJson.name,
            },
          },
        ],
      },
    ],
  ],
};
