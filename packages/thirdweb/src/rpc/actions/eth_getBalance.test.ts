import { describe, it, expect, vi, afterEach } from "vitest";
import { getRpcClient } from "../rpc.js";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { CLIENT_ID_CLIENT } from "~test/test-clients.js";
import { eth_getBalance } from "./eth_getBalance.js";
import {
  UNCLAIMED_ADDRESS,
  VITALIK_WALLET,
  ZERO_ADDRESS,
} from "~test/addresses.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

const rpcClient = getRpcClient({
  chain: FORKED_ETHEREUM_CHAIN,
  client: CLIENT_ID_CLIENT,
});

describe("eth_getBalance", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
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
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:8555",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([
          {
            method: "eth_getBalance",
            params: [VITALIK_WALLET, "latest"],
            id: 0,
            jsonrpc: "2.0",
          },
        ]),
      }),
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
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:8555",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([
          // this should be deduped
          {
            method: "eth_getBalance",
            params: [VITALIK_WALLET, "latest"],
            id: 0,
            jsonrpc: "2.0",
          },
          // but then there are 2 more in the batch because they are different addresses
          {
            method: "eth_getBalance",
            params: [ZERO_ADDRESS, "latest"],
            id: 1,
            jsonrpc: "2.0",
          },
          {
            method: "eth_getBalance",
            params: [UNCLAIMED_ADDRESS, "latest"],
            id: 2,
            jsonrpc: "2.0",
          },
        ]),
      }),
    );
  });
});
