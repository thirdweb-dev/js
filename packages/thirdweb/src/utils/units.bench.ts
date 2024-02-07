import { bench, describe } from "vitest";
import {
  formatUnits as viemFormatUnits,
  parseUnits as viemParseUnits,
} from "viem";
import { formatUnits, parseUnits } from "./units.js";
import {
  formatUnits as ethersFormatUnits,
  parseUnits as ethersParseUnits,
} from "ethers6";

describe("formatUnits", () => {
  describe("12345678901234567890n", () => {
    bench("thirdweb: `formatUnits`", () => {
      formatUnits(12345678901234567890n, 18);
    });

    bench("viem: `formatUnits`", () => {
      viemFormatUnits(12345678901234567890n, 18);
    });

    bench("ethers: `formatUnits`", () => {
      ethersFormatUnits(12345678901234567890n, 18);
    });
  });
  describe("40000000000000000000n", () => {
    bench("thirdweb: `formatUnits`", () => {
      formatUnits(40000000000000000000n, 18);
    });

    bench("viem: `formatUnits`", () => {
      viemFormatUnits(40000000000000000000n, 18);
    });

    bench("ethers: `formatUnits`", () => {
      ethersFormatUnits(40000000000000000000n, 18);
    });
  });
});

describe.only("parseUnits", () => {
  bench("thirdweb", () => {
    parseUnits("40", 18);
  });

  bench("viem", () => {
    viemParseUnits("40", 18);
  });

  bench("ethers@6", () => {
    ethersParseUnits("40", 18);
  });
});
