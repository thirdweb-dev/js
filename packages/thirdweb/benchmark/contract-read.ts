/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { Bench } from "tinybench";
import { Contract, getDefaultProvider } from "ethers6";
import {
  createPublicClient,
  http,
  getContract as viem_getContract,
} from "viem";
import { mainnet } from "viem/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { createClient, getContract } from "../src";
import { totalSupply } from "../src/extensions/erc20";

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

const bench = new Bench({ iterations: 10, warmupIterations: 1, throws: true });
bench.add("thirdweb@alpha", async () => {
  const client = createClient({
    clientId: "benchmark",
  });

  const contract = getContract({
    client,
    chain: 1,
    address: USDC_ADDRESS,
  });

  await totalSupply({
    contract,
  });
});
bench.add("@thirdweb-dev/sdk", async () => {
  const sdk = new ThirdwebSDK(1);

  const c = await sdk.getContract(USDC_ADDRESS);

  await c.erc20.totalSupply();
});
bench.add("viem", async () => {
  // the ABI of the contract
  const abi = [
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const contract = viem_getContract({ address: USDC_ADDRESS, abi, client });
  await contract.read.totalSupply();
});
bench.add("ethers@6", async () => {
  const abi = ["function totalSupply() view returns (uint256)"];

  const provider = getDefaultProvider(1);

  const c = new Contract(USDC_ADDRESS, abi, provider);
  await c.totalSupply();
});

await bench.warmup();
await bench.run();

console.table(bench.table());
