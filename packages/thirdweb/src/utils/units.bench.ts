import { bench, describe } from "vitest";
import {
  // eslint-disable-next-line no-restricted-imports
  formatUnits as viemFormatUnits,
  // eslint-disable-next-line no-restricted-imports
  parseUnits as viemParseUnits,
} from "viem";
import { toTokens, toUnits } from "./units.js";
import {
  formatUnits as ethersFormatUnits,
  parseUnits as ethersParseUnits,
} from "ethers6";

describe("formatUnits", () => {
  describe("12345678901234567890n", () => {
    bench("thirdweb: `toTokens`", () => {
      toTokens(12345678901234567890n, 18);
    });

    bench("viem: `formatUnits`", () => {
      viemFormatUnits(12345678901234567890n, 18);
    });

    bench("ethers: `formatUnits`", () => {
      ethersFormatUnits(12345678901234567890n, 18);
    });
  });
  describe("40000000000000000000n", () => {
    bench("thirdweb: `toTokens`", () => {
      toTokens(40000000000000000000n, 18);
    });

    bench("viem: `formatUnits`", () => {
      viemFormatUnits(40000000000000000000n, 18);
    });

    bench("ethers: `formatUnits`", () => {
      ethersFormatUnits(40000000000000000000n, 18);
    });
  });
});

describe("parseUnits", () => {
  bench("thirdweb", () => {
    toUnits("40", 18);
  });

  bench("viem", () => {
    viemParseUnits("40", 18);
  });

  bench("ethers@6", () => {
    ethersParseUnits("40", 18);
  });
});
