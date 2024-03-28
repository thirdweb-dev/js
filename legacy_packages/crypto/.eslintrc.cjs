module.exports = {
  root: true,
  extends: ["thirdweb"],
  rules: {
    "no-restricted-globals": [
      "error",
      {
        name: "Buffer",
        message: "Use Uint8Array instead.",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        name: "buffer",
        message: "Use Uint8Array instead.",
      },
      {
        name: "node:buffer",
        message: "Use Uint8Array instead.",
      },
    ],
  },
};
