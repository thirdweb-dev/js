import { defineChain } from "../utils.js";

export const moonbeam = /* @__PURE__ */ defineChain({
  id: 1284,
  name: "Moonbeam",
  nativeCurrency: {
    name: "Glimmer",
    symbol: "GLMR",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "moonscan",
      url: "https://moonbeam.moonscan.io",
    },
  ],
});
