module.exports = {
  root: true,
  extends: ["thirdweb"],
  plugins: ["better-tree-shaking"],
  rules: {
    "better-tree-shaking/no-top-level-side-effects": "error",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "eventemitter3",
            importNames: ["EventEmitter"],
            message:
              "Do not use named import for importing EventEmitter, Use default import instead.",
          },
        ],
      },
    ],
  },
};
