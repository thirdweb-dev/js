import { describe, it, expect, vi } from "vitest";
import { getRpcClient } from "../rpc.js";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { eth_getBalance } from "./eth_getBalance.js";
import {
  UNCLAIMED_ADDRESS,
  VITALIK_WALLET,
  ZERO_ADDRESS,
} from "~test/addresses.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

const rpcClient = getRpcClient({
  chain: FORKED_ETHEREUM_CHAIN,
  client: TEST_CLIENT,
});

describe("eth_getBalance", () => {
  it("should return the correct balance at the given block", async () => {
    const vitalikBalance = await eth_getBalance(rpcClient, {
      address: VITALIK_WALLET,
    });
    expect(vitalikBalance).toMatchInlineSnapshot(`24828863746828747877n`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should dedupe requests", async () => {
    const vitalikBalance1 = eth_getBalance(rpcClient, {
      address: VITALIK_WALLET,
    });
    const vitalikBalance2 = eth_getBalance(rpcClient, {
      address: VITALIK_WALLET,
    });
    expect(await vitalikBalance1).toMatchInlineSnapshot(
      `24828863746828747877n`,
    );
    expect(await vitalikBalance2).toMatchInlineSnapshot(
      `24828863746828747877n`,
    );
    // should only have been called once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    // check the exact payload, we should not have more than one ethBlockNumber request in the body!
    expect(fetchSpy.mock.lastCall?.[1]?.body).toMatchInlineSnapshot(
      `"[{"method":"eth_getBalance","params":["0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B","latest"],"id":0,"jsonrpc":"2.0"}]"`,
    );
  });

  it("should batch requests correctly", async () => {
    const vitalikBalance1 = eth_getBalance(rpcClient, {
      address: VITALIK_WALLET,
    });
    const vitalikBalance2 = eth_getBalance(rpcClient, {
      address: VITALIK_WALLET,
    });
    const zeroAddressBalance = eth_getBalance(rpcClient, {
      address: ZERO_ADDRESS,
    });
    const unknownAddressBalance = eth_getBalance(rpcClient, {
      address: UNCLAIMED_ADDRESS,
    });
    expect(await vitalikBalance1).toMatchInlineSnapshot(
      `24828863746828747877n`,
    );
    expect(await vitalikBalance2).toMatchInlineSnapshot(
      `24828863746828747877n`,
    );
    expect(await zeroAddressBalance).toMatchInlineSnapshot(
      `13347884805299021451868n`,
    );
    expect(await unknownAddressBalance).toMatchInlineSnapshot(
      `1234500000000000000n`,
    );
    // should only have been called once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    // check the exact payload, we should not have more than one ethBlockNumber request in the body!
    expect(fetchSpy.mock.lastCall?.[1]?.body).toMatchInlineSnapshot(
      `"[{"method":"eth_getBalance","params":["0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B","latest"],"id":0,"jsonrpc":"2.0"},{"method":"eth_getBalance","params":["0x0000000000000000000000000000000000000000","latest"],"id":1,"jsonrpc":"2.0"},{"method":"eth_getBalance","params":["0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef","latest"],"id":2,"jsonrpc":"2.0"}]"`,
    );
  });
});
