import { run, bench, group } from "mitata";
import { createThirdwebClient } from "../src/client/client";
import { defineChain } from "../src/chains/utils";
import { getContract } from "../src/contract/contract";
import { encode } from "../src/transaction/actions/encode";
import { transfer } from "../src/extensions/erc20/__generated__/IERC20/write/transfer";
// ethers
import { ethers } from "ethers6";
import * as viem from "viem";

const LOCAL_RPC = "http://localhost:8545";
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const VITALIK_WALLET = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const client = createThirdwebClient({
  clientId: "BENCH",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
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

const ethers6Contract = new ethers.Contract(
  USDC_CONTRACT_ADDRESS,
  ABI,
  ethers.getDefaultProvider(LOCAL_RPC),
);

const transfer_viem = viem.prepareEncodeFunctionData({
  abi: ABI,
  functionName: "transfer",
});

function randomBigint() {
  return BigInt(Math.floor(Math.random() * 1000));
}

group("encode transfer (warm cache)", () => {
  bench("thirdweb", async () => {
    const tx = transfer({
      contract: USDC_CONTRACT,
      to: VITALIK_WALLET,
      value: randomBigint(),
    });

    await encode(tx);
  });

  bench("ethers", async () => {
    ethers6Contract.interface.encodeFunctionData("transfer", [
      VITALIK_WALLET,
      randomBigint(),
    ]);
  });

  bench("viem", async () => {
    viem.encodeFunctionData({
      ...transfer_viem,
      args: [VITALIK_WALLET, randomBigint()],
    });
  });
});

group("encode transfer (cold cache)", () => {
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

    const tx = transfer({
      contract: contract,
      to: VITALIK_WALLET,
      value: randomBigint(),
    });
    await encode(tx);
  });

  bench("ethers", async () => {
    new ethers.Contract(
      USDC_CONTRACT_ADDRESS,
      ABI,
      ethers.getDefaultProvider(LOCAL_RPC),
    ).interface.encodeFunctionData("transfer", [
      VITALIK_WALLET,
      randomBigint(),
    ]);
  });

  bench("viem", async () => {
    viem.encodeFunctionData({
      ...transfer_viem,
      args: [VITALIK_WALLET, randomBigint()],
    });
  });
});

await run();
