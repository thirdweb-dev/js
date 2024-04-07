import { run, bench, group } from "mitata";

import { createThirdwebClient } from "../src/client/client";
import { getContract } from "../src/contract/contract";
import { defineChain } from "../src/chains/utils";
import { balanceOf } from "../src/extensions/erc20/__generated__/IERC20/read/balanceOf";

import { ethers } from "ethers6";
import * as viem from "viem";
import assert from "node:assert";

const LOCAL_RPC = "http://127.0.0.1:8545";
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const VITALIK_WALLET = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const client = createThirdwebClient({
  clientId: "BENCH",
  config: { rpc: { maxBatchSize: 1 } },
});

const USDC_CONTRACT = getContract({
  chain: defineChain({
    id: 1,
    rpc: LOCAL_RPC,
  }),
  client,
  address: USDC_CONTRACT_ADDRESS,
});

const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const staticEthersProvider = new ethers.JsonRpcProvider(LOCAL_RPC, 1, {
  staticNetwork: true,
  batchMaxCount: 1,
  cacheTimeout: 0,
});

const ethersContract = new ethers.Contract(
  USDC_CONTRACT_ADDRESS,
  ABI,
  staticEthersProvider,
);

const viemClient = viem.createPublicClient({ transport: viem.http(LOCAL_RPC) });

const viemContract = viem.getContract({
  abi: ABI,
  address: USDC_CONTRACT_ADDRESS,
  client: viemClient,
});

group("read contract (warm cache)", () => {
  bench("thirdweb", async () => {
    const bOf = await balanceOf({
      contract: USDC_CONTRACT,
      address: VITALIK_WALLET,
    });
    assert(bOf === 81831338n, "balanceOf should be 81831338");
  });

  bench("viem", async () => {
    const bOf = await viemContract.read.balanceOf([VITALIK_WALLET]);
    assert(bOf === 81831338n, "balanceOf should be 81831338");
  });

  bench("ethers", async () => {
    const bOf = await ethersContract.balanceOf(VITALIK_WALLET);
    assert(bOf === 81831338n, "balanceOf should be 81831338");
  });
});

group("read contract (cold cache)", () => {
  bench("thirdweb", async () => {
    // define chain
    const chain = defineChain({
      id: 1,
      rpc: LOCAL_RPC,
    });
    // get contract
    const contract = getContract({
      chain,
      client,
      address: USDC_CONTRACT_ADDRESS,
    });
    // actually read from the contract
    const bOf = await balanceOf({
      contract: contract,
      address: VITALIK_WALLET,
    });
    assert(bOf === 81831338n, "balanceOf should be 81831338");
  });

  bench("viem", async () => {
    const bOf = await viem
      .getContract({
        abi: ABI,
        address: USDC_CONTRACT_ADDRESS,
        client: viem.createPublicClient({ transport: viem.http(LOCAL_RPC) }),
      })
      .read.balanceOf([VITALIK_WALLET]);
    assert(bOf === 81831338n, "balanceOf should be 81831338");
  });

  bench("ethers", async () => {
    const bOf = await new ethers.Contract(
      USDC_CONTRACT_ADDRESS,
      ABI,
      new ethers.JsonRpcProvider(LOCAL_RPC, 1, {
        staticNetwork: true,
        batchMaxCount: 1,
        cacheTimeout: 0,
      }),
    ).balanceOf(VITALIK_WALLET);
    assert(bOf === 81831338n, "balanceOf should be 81831338");
  });
});

await run();
