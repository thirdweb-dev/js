import { describe, bench } from "vitest";

// local imports
import {
  createThirdwebClient,
  defineChain,
  sendTransaction,
  prepareTransaction,
} from "..";
// eslint-disable-next-line no-restricted-imports
import { privateKeyAccount } from "../src/exports/wallets";
import { ThirdwebSDK } from "../../sdk";

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const LOCAL_RPC = "http://localhost:8555";
const VITALIK_WALLET = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const client = createThirdwebClient({
  secretKey: SECRET_KEY,
  config: { rpc: { maxBatchSize: 1 } },
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

describe.runIf(SECRET_KEY)("send native transfer", () => {
  bench("thirdweb", async () => {
    const transaction = prepareTransaction({
      client,
      chain: TEST_CHAIN,
      value: randomBigint(),
      to: VITALIK_WALLET,
    });
    try {
      await sendTransaction({ transaction, account });
    } catch (e) {
      console.error(e);
    }
  });

  bench("@thirdweb-dev/sdk", async () => {
    await sdk.wallet.sendRawTransaction({
      to: VITALIK_WALLET,
      value: randomBigint(),
    });
  });
});
