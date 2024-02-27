import { describe, bench } from "vitest";

// local imports
import {
  createThirdwebClient,
  defineChain,
  sendTransaction,
  prepareTransaction,
} from "..";
import { privateKeyAccount } from "../dist/esm/wallets/private-key";
import { ThirdwebSDK } from "../../sdk/dist/thirdweb-dev-sdk.cjs";

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const LOCAL_RPC = "http://localhost:8555";
const VITALIK_WALLET = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const client = createThirdwebClient({
  secretKey: SECRET_KEY,
});

const TEST_CHAIN = defineChain({
  id: 1,
  rpc: LOCAL_RPC,
});

const PKEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const account = privateKeyAccount({
  privateKey: PKEY,
  client,
});

const sdk = ThirdwebSDK.fromPrivateKey(PKEY, LOCAL_RPC, {
  secretKey: SECRET_KEY,
  readonlySettings: {
    chainId: 1,
    rpcUrl: LOCAL_RPC,
  },
});

// const OLD_CONTRACT = await sdk.getContract(USDC_CONTRACT_ADDRESS);

function randomBigint() {
  return BigInt(Math.floor(Math.random() * 1000));
}

describe.runIf(SECRET_KEY)("encode native transfer", () => {
  bench("thirdweb", async () => {
    const transaction = prepareTransaction({
      client,
      chain: TEST_CHAIN,
      value: randomBigint(),
      to: VITALIK_WALLET,
    });
    await sendTransaction({ transaction, account });
  });

  bench("@thirdweb-dev/sdk", async () => {
    await sdk.wallet.sendRawTransaction({
      to: VITALIK_WALLET,
      value: randomBigint(),
    });
  });
});
