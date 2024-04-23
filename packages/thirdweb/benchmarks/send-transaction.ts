import { bench, group, run } from "mitata";

import { defineChain } from "../src/chains/utils";
import { createThirdwebClient } from "../src/client/client";
import { sendTransaction } from "../src/transaction/actions/send-transaction";
import { prepareTransaction } from "../src/transaction/prepare-transaction";
import { privateKeyToAccount } from "../src/wallets/private-key";

import * as ethers from "ethers6";
import * as viem from "viem";
import { privateKeyToAccount as viemPrivateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const LOCAL_RPC = "http://127.0.0.1:8545";
const VITALIK_WALLET = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

const client = createThirdwebClient({
  clientId: "BENCH",
  config: { rpc: { maxBatchSize: 1 } },
});

const TEST_CHAIN = defineChain({
  id: 1,
  rpc: LOCAL_RPC,
});

const PKEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const account = privateKeyToAccount({
  privateKey: PKEY,
  client,
});

// viem setup
const privateKeyAccountViem = viemPrivateKeyToAccount(PKEY);
const walletClient = viem.createWalletClient({
  account: privateKeyAccountViem,
  transport: viem.http(LOCAL_RPC),
});

// ethers setup
const provider = new ethers.JsonRpcProvider(LOCAL_RPC, 1, {
  staticNetwork: true,
  batchMaxCount: 1,
  cacheTimeout: 0,
});
const wallet = new ethers.Wallet(PKEY, provider);

function randomBigint() {
  return BigInt(Math.floor(Math.random() * 1000));
}

group("transfer native tokens", () => {
  bench("thirdweb", async () => {
    const transaction = prepareTransaction({
      client,
      chain: TEST_CHAIN,
      value: randomBigint(),
      to: VITALIK_WALLET,
    });

    await sendTransaction({ transaction, account });
  });

  bench("viem", async () => {
    await walletClient.sendTransaction({
      chain: mainnet,
      value: randomBigint(),
      to: VITALIK_WALLET,
    });
  });

  bench("ethers", async () => {
    await wallet.sendTransaction({
      to: VITALIK_WALLET,
      value: randomBigint(),
    });
  });
});

await run();
