import { defineChain as viemChain } from "viem";
import { describe, expect, it } from "vitest";
import { defineChain } from "./utils.js";

describe("defineChain", () => {
  it("should convert viem chain to thirdweb chain", () => {
    const zoraViem = viemChain({
      id: 7777777,
      name: "Zora",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: ["https://rpc.zora.energy"],
          webSocket: ["wss://rpc.zora.energy"],
        },
      },
      blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.zora.energy" },
      },
    });
    const thirdwebViem = defineChain(zoraViem);

    expect(thirdwebViem.id).toEqual(zoraViem.id);
    expect(thirdwebViem.name).toEqual(zoraViem.name);
    expect(thirdwebViem.nativeCurrency).toEqual(zoraViem.nativeCurrency);
    expect(thirdwebViem.rpc).toEqual(zoraViem.rpcUrls.default.http[0]);
  });

  it("should cache custom chains", () => {
    const chain = defineChain({ id: 1, name: "Test", rpc: "https://test.com" });
    expect(defineChain(1).rpc).toEqual(chain.rpc);
  });

  it("should overwrite custom chains with same id", () => {
    defineChain({ id: 1, name: "Test", rpc: "https://test.com" });
    const chain2 = defineChain({
      id: 1,
      name: "Test2",
      rpc: "https://test2.com",
    });
    expect(defineChain(1).rpc).toEqual(chain2.rpc);
  });
});
