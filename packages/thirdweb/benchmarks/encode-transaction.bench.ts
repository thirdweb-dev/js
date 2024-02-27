import { describe, bench } from "vitest";

// local imports
import {
  createThirdwebClient,
  getContract,
  defineChain,
  encode,
  prepareContractCall,
} from "..";
import { ThirdwebSDK } from "../../sdk";
import { LocalWallet } from "../../wallets";

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

const wallet = new LocalWallet();

await wallet.generate();

const sdk = await ThirdwebSDK.fromWallet(wallet, LOCAL_RPC, {
  secretKey: SECRET_KEY,
  readonlySettings: {
    chainId: 1,
    rpcUrl: LOCAL_RPC,
  },
});

const OLD_CONTRACT = await sdk.getContract(USDC_CONTRACT_ADDRESS);

function randomBigint() {
  return BigInt(Math.floor(Math.random() * 1000));
}

describe.runIf(SECRET_KEY)("encode transfer (warm cache)", () => {
  bench("thirdweb", async () => {
    const tx = prepareContractCall({
      contract: NEW_CONTRACT,
      method: "function transfer(address,uint256)",
      params: [VITALIK_WALLET, randomBigint()],
    });
    await encode(tx);
  });

  bench("@thirdweb-dev/sdk", async () => {
    OLD_CONTRACT.prepare("transfer", [VITALIK_WALLET, randomBigint()]).encode();
  });
});

describe.runIf(SECRET_KEY)("encode transfer (cold cache)", () => {
  bench("thirdweb", async () => {
    // init the client
    const newClient = createThirdwebClient({
      secretKey: SECRET_KEY,
    });
    // define chain
    const chain = defineChain({
      id: 1,
      rpc: LOCAL_RPC,
    });
    // get contract
    const contract = getContract({
      chain,
      client: newClient,
      address: USDC_CONTRACT_ADDRESS,
    });

    const tx = prepareContractCall({
      contract: contract,
      method: "function transfer(address,uint256)",
      params: [VITALIK_WALLET, randomBigint()],
    });
    await encode(tx);
  });

  bench("@thirdweb-dev/sdk", async () => {
    //get the contract
    const contract = await sdk.getContract(USDC_CONTRACT_ADDRESS);
    // actually read from the contract
    contract.prepare("transfer", [VITALIK_WALLET, randomBigint()]).encode();
  });
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

describe.runIf(SECRET_KEY)("read contract (pre-defined abi)", () => {
  bench("thirdweb", async () => {
    // init the client
    const newClient = createThirdwebClient({
      secretKey: SECRET_KEY,
    });
    // define chain
    const chain = defineChain({
      id: 1,
      rpc: LOCAL_RPC,
    });
    // get contract
    const contract = getContract({
      chain,
      client: newClient,
      address: USDC_CONTRACT_ADDRESS,
    });

    const tx = prepareContractCall({
      contract: contract,
      method: "function transfer(address,uint256)",
      params: [VITALIK_WALLET, randomBigint()],
    });
    await encode(tx);
  });

  bench("@thirdweb-dev/sdk", async () => {
    //get the contract
    const contract = await sdk.getContractFromAbi(USDC_CONTRACT_ADDRESS, ABI);
    // actually read from the contract
    contract.prepare("transfer", [VITALIK_WALLET, randomBigint()]).encode();
  });
});
