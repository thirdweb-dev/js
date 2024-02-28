import { describe, bench } from "vitest";

// local imports
import {
  readContract,
  createThirdwebClient,
  getContract,
  defineChain,
} from "..";
import { ThirdwebSDK } from "../../sdk";
import { ethers as ethers5 } from "ethers5";
import { ethers as ethers6 } from "ethers6";
// eslint-disable-next-line no-restricted-imports
import * as viem from "viem";

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const LOCAL_RPC = "http://localhost:8555";
const USDC_CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const VITALIK_WALLET = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const client = createThirdwebClient({
  secretKey: SECRET_KEY,
});

const NEW_CONTRACT = getContract({
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

const sdk = new ThirdwebSDK(LOCAL_RPC, {
  secretKey: SECRET_KEY,
  readonlySettings: {
    chainId: 1,
    rpcUrl: LOCAL_RPC,
  },
});

const OLD_CONTRACT = await sdk.getContract(USDC_CONTRACT_ADDRESS);

const ethers5Contract = new ethers5.Contract(
  USDC_CONTRACT_ADDRESS,
  ABI,
  ethers5.getDefaultProvider(LOCAL_RPC),
);

const ethers6Contract = new ethers6.Contract(
  USDC_CONTRACT_ADDRESS,
  ABI,
  ethers6.getDefaultProvider(LOCAL_RPC),
);

const viemClient = viem.createPublicClient({ transport: viem.http(LOCAL_RPC) });

const viemContract = viem.getContract({
  abi: ABI,
  address: USDC_CONTRACT_ADDRESS,
  client: viemClient,
});

describe.runIf(SECRET_KEY)("read contract (warm cache)", () => {
  bench("thirdweb", async () => {
    await readContract({
      contract: NEW_CONTRACT,
      method: "function balanceOf(address) returns (uint256)",
      params: [VITALIK_WALLET],
    });
  });

  bench("@thirdweb-dev/sdk", async () => {
    await OLD_CONTRACT.call("balanceOf", [VITALIK_WALLET]);
  });

  bench("ethers@5", async () => {
    await ethers5Contract.callStatic.balanceOf(VITALIK_WALLET);
  });

  bench("ethers@6", async () => {
    await ethers6Contract.balanceOf(VITALIK_WALLET);
  });

  bench("viem", async () => {
    await viemContract.read.balanceOf([VITALIK_WALLET]);
  });
});

describe.runIf(SECRET_KEY)("read contract (cold cache)", () => {
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
    await readContract({
      contract,
      method: "function balanceOf(address) returns (uint256)",
      params: [VITALIK_WALLET],
    });
  });

  bench("@thirdweb-dev/sdk", async () => {
    //get the contract
    const contract = await sdk.getContract(USDC_CONTRACT_ADDRESS);
    // actually read from the contract
    await contract.call("balanceOf", [VITALIK_WALLET]);
  });

  bench("ethers@5", async () => {
    await new ethers5.Contract(
      USDC_CONTRACT_ADDRESS,
      ABI,
      ethers5.getDefaultProvider(LOCAL_RPC),
    ).callStatic.balanceOf(VITALIK_WALLET);
  });

  bench("ethers@6", async () => {
    await new ethers6.Contract(
      USDC_CONTRACT_ADDRESS,
      ABI,
      ethers6.getDefaultProvider(LOCAL_RPC),
    ).balanceOf(VITALIK_WALLET);
  });

  bench("viem", async () => {
    await viem
      .getContract({
        abi: ABI,
        address: USDC_CONTRACT_ADDRESS,
        client: viem.createPublicClient({ transport: viem.http(LOCAL_RPC) }),
      })
      .read.balanceOf([VITALIK_WALLET]);
  });
});
