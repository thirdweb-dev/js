import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { defineChain } from "../../chains/utils.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { claimTo } from "../../extensions/erc1155/drops/write/claimTo.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { setThirdwebDomains } from "../../utils/domains.js";
import { smartWallet } from "../create-wallet.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: string;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = defineChain(300);
const client = TEST_CLIENT;

const contract = getContract({
  address: "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77", // edition drop
  chain,
  client,
});

describe.runIf(process.env.TW_SECRET_KEY)(
  "SmartWallet zksync tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      setThirdwebDomains({
        rpc: "rpc.thirdweb-dev.com",
      });
      personalAccount = await generateAccount({
        client,
      });
      wallet = smartWallet({
        chain,
        gasless: true,
        overrides: {
          bundlerUrl: "http://localhost:8787?chain=300",
        },
      });
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      smartWalletAddress = smartAccount.address;
      accountContract = getContract({
        address: smartWalletAddress,
        chain,
        client,
      });
    });

    it("should send a transactions", async () => {
      const tx = await sendAndConfirmTransaction({
        transaction: claimTo({
          contract,
          quantity: 1n,
          to: smartWalletAddress,
          tokenId: 0n,
        }),
        account: smartAccount,
      });

      expect(tx.transactionHash.length).toBe(66);
    });
  },
);
