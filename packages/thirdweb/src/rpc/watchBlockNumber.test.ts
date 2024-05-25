import { beforeEach, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../test/src/chains.js";
import { TEST_CLIENT } from "../../test/src/test-clients.js";
import { mineBlock } from "../../test/src/utils.js";
import { baseSepolia } from "../chains/chain-definitions/base-sepolia.js";
import { wait } from "../utils/promise/wait.js";
import { watchBlockNumber } from "./watchBlockNumber.js";

describe.runIf(process.env.TW_SECRET_KEY)("watch block number", () => {
  const onNewBlockNumber = vi.fn();
  const onNewBlockNumber2 = vi.fn();

  beforeEach(() => {
    onNewBlockNumber.mockClear();
    onNewBlockNumber2.mockClear();
  });

  it("should set up the watcher", () => {
    const onNewBlockNumber = vi.fn();
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: baseSepolia,
      onNewBlockNumber,
    });

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);
    expect(unwatch).toBeTypeOf("function");

    unwatch();
  });

  it("should call the onNewBlockNumber callback", async () => {
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      onNewBlockNumber,
    });

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();

    unwatch();
  });

  it("should re-use the same watcher for multiple calls", async () => {
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      onNewBlockNumber,
    });
    const unwatch2 = watchBlockNumber({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      onNewBlockNumber: onNewBlockNumber2,
    });

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);
    expect(onNewBlockNumber2).toHaveBeenCalledTimes(0);

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();
    expect(onNewBlockNumber2).toHaveBeenCalled();

    // TODO: ensure that unwatch and unwatch2 are acting on the same poller

    unwatch();
    unwatch2();
  });

  it("should stop polling when unsubscribed", async () => {
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      onNewBlockNumber,
    });

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();

    onNewBlockNumber.mockClear();

    unwatch();

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);
  });

  it("should re-start from a fresh block when fully unsubscribed and re-subscribed", async () => {
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      onNewBlockNumber,
    });

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();

    const lastBlockNumber = onNewBlockNumber.mock.lastCall?.[0];

    onNewBlockNumber.mockClear();

    unwatch();

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);

    const unwatch2 = watchBlockNumber({
      client: TEST_CLIENT,
      chain: baseSepolia,
      onNewBlockNumber,
    });

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();

    const firstBlockNumber = onNewBlockNumber.mock.calls[0]?.[0];

    // we need to have skipped blocks here
    expect(firstBlockNumber).toBeGreaterThan(lastBlockNumber + 1n);

    unwatch2();
  });

  it("should re-start from latestBlockNumber if provided", async () => {
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      onNewBlockNumber,
    });

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();

    const lastBlockNumber = onNewBlockNumber.mock.lastCall?.[0];

    onNewBlockNumber.mockClear();

    unwatch();

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalledTimes(0);

    const unwatch2 = watchBlockNumber({
      client: TEST_CLIENT,
      chain: baseSepolia,
      onNewBlockNumber,
      latestBlockNumber: lastBlockNumber,
    });

    await mineBlock(ANVIL_CHAIN);

    expect(onNewBlockNumber).toHaveBeenCalled();

    const firstBlockNumber = onNewBlockNumber.mock.calls[0]?.[0];

    expect(firstBlockNumber).toEqual(lastBlockNumber + 1n);

    unwatch2();
  });

  it("should start from latestBlockNumber", async () => {
    const unwatch = watchBlockNumber({
      client: TEST_CLIENT,
      chain: baseSepolia,
      onNewBlockNumber,
      latestBlockNumber: 9342233n,
    });

    await wait(500);

    expect(onNewBlockNumber.mock.calls[0]?.[0]).toEqual(9342234n);

    unwatch();
  });
});
