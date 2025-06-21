import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
  TEST_ACCOUNT_D,
} from "~test/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { deployERC20Contract } from "../../../extensions/prebuilts/deploy-erc20.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf } from "../__generated__/IERC20/read/balanceOf.js";
import { mintTo } from "./mintTo.js";
import { optimizeTransferContent, transferBatch } from "./transferBatch.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const account = TEST_ACCOUNT_A;
let contract: ThirdwebContract;

describe.runIf(process.env.TW_SECRET_KEY)("erc20: transferBatch", () => {
  beforeAll(async () => {
    const address = await deployERC20Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "TokenERC20",
    });
    contract = getContract({
      address,
      chain,
      client,
    });
  }, 60_000_000);
  it("should transfer tokens to multiple recipients", async () => {
    // Mint 200 tokens
    await sendAndConfirmTransaction({
      account,
      transaction: mintTo({ amount: 200, contract, to: account.address }),
    });

    // Send 25 tokens to each account B, C and D
    await sendAndConfirmTransaction({
      account,
      transaction: transferBatch({
        batch: [
          {
            amount: 25,
            to: TEST_ACCOUNT_B.address,
          },
          {
            amount: 25,
            to: TEST_ACCOUNT_C.address,
          },
          {
            amount: 25,
            to: TEST_ACCOUNT_D.address,
          },
          {
            amount: 25,
            to: TEST_ACCOUNT_B.address.toLowerCase(),
          },
          {
            amountWei: 25n * 10n ** 18n,
            to: TEST_ACCOUNT_B.address,
          },
        ],
        contract,
      }),
    });

    // After that, each address A, B, C and D should have 25 tokens
    const [balanceA, balanceB, balanceC, balanceD] = await Promise.all([
      balanceOf({ address: TEST_ACCOUNT_A.address, contract }),
      balanceOf({ address: TEST_ACCOUNT_B.address, contract }),
      balanceOf({ address: TEST_ACCOUNT_C.address, contract }),
      balanceOf({ address: TEST_ACCOUNT_D.address, contract }),
    ]);

    expect(balanceA).toBe(75n * 10n ** 18n);
    expect(balanceB).toBe(75n * 10n ** 18n);
    expect(balanceC).toBe(25n * 10n ** 18n);
    expect(balanceD).toBe(25n * 10n ** 18n);
  });

  it("should optimize the transfer content", async () => {
    const content = await optimizeTransferContent({
      batch: [
        {
          amount: 25,
          to: TEST_ACCOUNT_B.address,
        },
        {
          amount: 25,
          to: TEST_ACCOUNT_C.address,
        },
        {
          amount: 25,
          to: TEST_ACCOUNT_D.address,
        },
        {
          amount: 25,
          // Should work
          to: TEST_ACCOUNT_B.address.toLowerCase(),
        },
        {
          amountWei: 25n * 10n ** 18n,
          to: TEST_ACCOUNT_B.address,
        },
      ],
      contract,
    });

    expect(content).toStrictEqual([
      {
        amountWei: 75n * 10n ** 18n,
        to: TEST_ACCOUNT_B.address,
      },
      {
        amountWei: 25n * 10n ** 18n,
        to: TEST_ACCOUNT_C.address,
      },
      {
        amountWei: 25n * 10n ** 18n,
        to: TEST_ACCOUNT_D.address,
      },
    ]);
  });

  it("an already-optimized content should not be changed", async () => {
    const content = await optimizeTransferContent({
      batch: [
        {
          amountWei: 25n * 10n ** 18n,
          to: TEST_ACCOUNT_B.address,
        },
        {
          amount: 25,
          to: TEST_ACCOUNT_C.address,
        },
        {
          amount: 25,
          to: TEST_ACCOUNT_D.address,
        },
      ],
      contract,
    });

    expect(content).toStrictEqual([
      {
        amountWei: 25n * 10n ** 18n,
        to: TEST_ACCOUNT_B.address,
      },
      {
        amountWei: 25n * 10n ** 18n,
        to: TEST_ACCOUNT_C.address,
      },
      {
        amountWei: 25n * 10n ** 18n,
        to: TEST_ACCOUNT_D.address,
      },
    ]);
  });
});
