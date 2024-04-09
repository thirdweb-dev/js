import { run, bench, group } from "mitata";

import { getRpcClient } from "../src/rpc/rpc.js";
import { createThirdwebClient } from "../src/client/client.js";
import { eth_blockNumber } from "../src/rpc/actions/eth_blockNumber.js";
import { defineChain } from "../src/chains/utils.js";

import * as viem from "viem";
import * as ethers from "ethers6";
import assert from "node:assert";

const LOCAL_RPC = "http://127.0.0.1:8545";

const clientNoBatching = createThirdwebClient({
  clientId: "BENCH",
  config: { rpc: { maxBatchSize: 1 } },
});

const clientWithBatching = createThirdwebClient({ clientId: "BENCH" });

const rpcRequestNoBatching = getRpcClient({
  client: clientNoBatching,
  chain: defineChain({
    id: 1,
    rpc: LOCAL_RPC,
  }),
});

const rpcRequestBatching = getRpcClient({
  client: clientWithBatching,
  chain: defineChain({
    id: 1,
    rpc: LOCAL_RPC,
  }),
});

// // viem setup

const publicClientNoBatching = viem.createPublicClient({
  transport: viem.http(LOCAL_RPC),
});

const publicClientBatching = viem.createPublicClient({
  transport: viem.http(LOCAL_RPC, {
    batch: { batchSize: 100, wait: 0 },
  }),
});

// ethers setup
const ethersProviderNoBatching = new ethers.JsonRpcProvider(LOCAL_RPC, 1, {
  staticNetwork: true,
  batchMaxCount: 1,
  cacheTimeout: 0,
});

const ethersProviderBatching = new ethers.JsonRpcProvider(LOCAL_RPC, 1, {
  staticNetwork: true,
  batchMaxCount: 100,
  batchStallTime: 0,
  cacheTimeout: 0,
});

group("rpc (batching disabled)", () => {
  bench("thirdweb", async () => {
    const bn = await eth_blockNumber(rpcRequestNoBatching);
    assert(bn === 19139495n, "unexpected block number");
  });

  bench("viem", async () => {
    // disabling the cache to be more representative
    const bn = await publicClientNoBatching.getBlockNumber({ cacheTime: 0 });
    assert(bn === 19139495n, "unexpected block number");
  });

  bench("ethers", async () => {
    const bn = await ethersProviderNoBatching.getBlockNumber();
    assert(bn === 19139495, "unexpected block number");
  });
});

group("rpc (batching enabled)", () => {
  bench("thirdweb", async () => {
    const bn = await eth_blockNumber(rpcRequestBatching);
    assert(bn === 19139495n, "unexpected block number");
  });

  bench("viem", async () => {
    // disabling the cache to be more representative
    const bn = await publicClientBatching.getBlockNumber({ cacheTime: 0 });
    assert(bn === 19139495n, "unexpected block number");
  });

  bench("ethers", async () => {
    const bn = await ethersProviderBatching.getBlockNumber();
    assert(bn === 19139495, "unexpected block number");
  });
});

await run();
