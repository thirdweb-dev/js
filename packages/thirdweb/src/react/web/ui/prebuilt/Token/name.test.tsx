import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import {} from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  UNISWAPV3_FACTORY_CONTRACT,
  USDT_CONTRACT,
} from "~test/test-contracts.js";
import { ethereum } from "../../../../../chains/chain-definitions/ethereum.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../constants/addresses.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { fetchTokenName, getQueryKeys } from "./name.js";

const client = TEST_CLIENT;

describe.runIf(process.env.TW_SECRET_KEY)("TokenName component", () => {
  it("fetchTokenName should respect the nameResolver being a string", async () => {
    const res = await fetchTokenName({
      address: "thing",
      client,
      chain: ANVIL_CHAIN,
      nameResolver: "tw",
    });
    expect(res).toBe("tw");
  });

  it("fetchTokenName should respect the nameResolver being a non-async function", async () => {
    const res = await fetchTokenName({
      address: "thing",
      client,
      chain: ANVIL_CHAIN,
      nameResolver: () => "tw",
    });

    expect(res).toBe("tw");
  });

  it("fetchTokenName should respect the nameResolver being an async function", async () => {
    const res = await fetchTokenName({
      address: "thing",
      client,
      chain: ANVIL_CHAIN,
      nameResolver: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return "tw";
      },
    });

    expect(res).toBe("tw");
  });

  it("fetchTokenName should work for contract with `name` function", async () => {
    const res = await fetchTokenName({
      address: USDT_CONTRACT.address,
      client,
      chain: USDT_CONTRACT.chain,
    });

    expect(res).toBe("Tether USD");
  });

  it("fetchTokenName should work for native token", async () => {
    const res = await fetchTokenName({
      address: NATIVE_TOKEN_ADDRESS,
      client,
      chain: ethereum,
    });

    expect(res).toBe("Ether");
  });

  it("fetchTokenName should try to fallback to the contract metadata if fails to resolves from `name()`", async () => {
    // todo: find a contract with name in contractMetadata, but does not have a name function
  });

  it("fetchTokenName should throw in the end where all fallback solutions failed to resolve to any name", async () => {
    await expect(() =>
      fetchTokenName({
        address: UNISWAPV3_FACTORY_CONTRACT.address,
        client,
        chain: UNISWAPV3_FACTORY_CONTRACT.chain,
      }),
    ).rejects.toThrowError(
      "Failed to resolve name from both name() and contract metadata",
    );
  });

  it("getQueryKeys should work without resolver", () => {
    expect(getQueryKeys({ chainId: 1, address: "0x" })).toStrictEqual([
      "_internal_token_name_",
      1,
      "0x",
      {
        resolver: undefined,
      },
    ]);
  });

  it("getQueryKeys should work with resolver being a string", () => {
    expect(
      getQueryKeys({ chainId: 1, address: "0x", nameResolver: "tw" }),
    ).toStrictEqual([
      "_internal_token_name_",
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
      getQueryKeys({ chainId: 1, address: "0x", nameResolver: fn }),
    ).toStrictEqual([
      "_internal_token_name_",
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
        nameResolver: fn,
      }),
    ).toStrictEqual([
      "_internal_token_name_",
      1,
      "0x",
      {
        resolver: fnId,
      },
    ]);
  });
});
