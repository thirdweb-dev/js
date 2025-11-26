import { defineChain } from "../utils.js";

/**
 * @chain
 */
export const monad = /*@__PURE__*/ defineChain({
  blockExplorers: [
    {
      name: "Monad Vision",
      url: "https://monadvision.com/",
    },
    {
      name: "Monad Scan",
      url: "https://monadscan.com/",
    },
  ],
  id: 143,
  name: "Monad",
  nativeCurrency: { decimals: 18, name: "Mon", symbol: "MON" },
});
