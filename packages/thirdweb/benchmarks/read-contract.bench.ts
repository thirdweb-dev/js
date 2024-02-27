import { describe, bench } from "vitest";

// local imports
import {
  readContract,
  createThirdwebClient,
  getContract,
  defineChain,
} from "..";
import { ThirdwebSDK } from "../../sdk";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

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

const OLD_CONTRACT = await new ThirdwebSDK(LOCAL_RPC, {
  secretKey: SECRET_KEY,
  readonlySettings: {
    chainId: 1,
    rpcUrl: LOCAL_RPC,
  },
}).getContract(USDC_CONTRACT_ADDRESS);

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
});

describe.runIf(SECRET_KEY)("read contract (cold cache)", () => {
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
    // actually read from the contract
    await readContract({
      contract,
      method: "function balanceOf(address) returns (uint256)",
      params: [VITALIK_WALLET],
    });
  });

  bench("@thirdweb-dev/sdk", async () => {
    // init the sdk
    const sdk = new ThirdwebSDK(LOCAL_RPC, {
      secretKey: SECRET_KEY,
      readonlySettings: {
        chainId: 1,
        rpcUrl: LOCAL_RPC,
      },
    });
    //get the contract
    const contract = await sdk.getContract(USDC_CONTRACT_ADDRESS);
    // actually read from the contract
    await contract.call("balanceOf", [VITALIK_WALLET]);
  });
});
