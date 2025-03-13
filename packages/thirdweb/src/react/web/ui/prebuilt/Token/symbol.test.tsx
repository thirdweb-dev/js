import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  UNISWAPV3_FACTORY_CONTRACT,
  USDT_CONTRACT,
} from "~test/test-contracts.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { fetchTokenSymbol, getQueryKeys } from "./symbol.js";

const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("TokenSymbol component", () => {
  it("fetchTokenSymbol should respect the symbolResolver being a string", async () => {
    const res = await fetchTokenSymbol({
      address: "thing",
      client,
      chain: ANVIL_CHAIN,
      symbolResolver: "tw",
    });
    expect(res).toBe("tw");
  });

  it("fetchTokenSymbol should respect the symbolResolver being a non-async function", async () => {
    const res = await fetchTokenSymbol({
      address: "thing",
      client,
      chain: ANVIL_CHAIN,
      symbolResolver: () => "tw",
    });

    expect(res).toBe("tw");
  });

  it("fetchTokenSymbol should respect the symbolResolver being an async function", async () => {
    const res = await fetchTokenSymbol({
      address: "thing",
      client,
      chain: ANVIL_CHAIN,
      symbolResolver: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return "tw";
      },
    });

    expect(res).toBe("tw");
  });

  it("fetchTokenSymbol should work for contract with `symbol` function", async () => {
    const res = await fetchTokenSymbol({
      address: USDT_CONTRACT.address,
      client,
      chain: USDT_CONTRACT.chain,
    });

    expect(res).toBe("USDT");
  });

  it("fetchTokenSymbol should work for native token", async () => {
    const res = await fetchTokenSymbol({
      address: NATIVE_TOKEN_ADDRESS,
      client,
      chain: ethereum,
    });

    expect(res).toBe("ETH");
  });

  it("fetchTokenSymbol should try to fallback to the contract metadata if fails to resolves from `symbol()`", async () => {
    // todo: find a contract with symbol in contractMetadata, but does not have a symbol function
  });

  it("fetchTokenSymbol should throw in the end where all fallback solutions failed to resolve to any symbol", async () => {
    await expect(
      fetchTokenSymbol({
        address: UNISWAPV3_FACTORY_CONTRACT.address,
        client,
        chain: UNISWAPV3_FACTORY_CONTRACT.chain,
      }),
    ).rejects.toThrowError(
      "Failed to resolve symbol from both symbol() and contract metadata",
    );
  });

  it("getQueryKeys should work without resolver", () => {
    expect(getQueryKeys({ chainId: 1, address: "0x" })).toStrictEqual([
      "_internal_token_symbol_",
      1,
      "0x",
      {
        resolver: undefined,
      },
    ]);
  });

  it("getQueryKeys should work with resolver being a string", () => {
    expect(
      getQueryKeys({ chainId: 1, address: "0x", symbolResolver: "tw" }),
    ).toStrictEqual([
      "_internal_token_symbol_",
      1,
      "0x",
      {
        resolver: "tw",
      },
    ]);
  });

  it("getQueryKeys should work with resolver being a non-async fn that returns a string", () => {
    const fn = () => "tw";
    const fnId = getFunctionId(fn);
    expect(
      getQueryKeys({ chainId: 1, address: "0x", symbolResolver: fn }),
    ).toStrictEqual([
      "_internal_token_symbol_",
      1,
      "0x",
      {
        resolver: fnId,
      },
    ]);
  });

  it("getQueryKeys should work with resolver being an async fn that returns a string", () => {
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return "tw";
    };
    const fnId = getFunctionId(fn);
    expect(
      getQueryKeys({
        chainId: 1,
        address: "0x",
        symbolResolver: fn,
      }),
    ).toStrictEqual([
      "_internal_token_symbol_",
      1,
      "0x",
      {
        resolver: fnId,
      },
    ]);
  });
});
