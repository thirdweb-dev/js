import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { typedData } from "../../../test/src/typed-data.js";
import { verifySignature } from "../../auth/verify-signature.js";
import { verifyTypedData } from "../../auth/verify-typed-data.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { sendBatchTransaction } from "../../transaction/actions/send-batch-transaction.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Address } from "../../utils/address.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { confirmContractDeployment } from "./lib/signing.js";
import * as Config from "./presets/index.js";
import { smartWallet } from "./smart-wallet.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: Address;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = baseSepolia;
const client = TEST_CLIENT;

const DEFAULT_FACTORY_ADDRESS = "0xB1846E893CA01c5Dcdaa40371C1e13f2e0Df5717";
const DEFAULT_VALIDATOR_ADDRESS = "0x7D3631d823e0De311DC86f580946EeF2eEC81fba";

describe.runIf(process.env.TW_SECRET_KEY).sequential(
  "SmartWallet modular tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      personalAccount = await generateAccount({
        client,
      });
      wallet = smartWallet(
        Config.erc7579({
          chain,
          factoryAddress: DEFAULT_FACTORY_ADDRESS,
          sponsorGas: true,
          validatorAddress: DEFAULT_VALIDATOR_ADDRESS,
        }),
      );
      smartAccount = await wallet.connect({
        client: TEST_CLIENT,
        personalAccount,
      });
      smartWalletAddress = smartAccount.address as Address;
      accountContract = getContract({
        address: smartWalletAddress,
        chain,
        client,
      });
    });

    it("can connect", async () => {
      expect(smartWalletAddress).toHaveLength(42);
    });

    it("can sign a msg", async () => {
      const signature = await smartAccount.signMessage({
        message: "hello world",
      });
      const isValid = await verifySignature({
        address: smartWalletAddress,
        chain,
        client,
        message: "hello world",
        signature,
      });
      expect(isValid).toEqual(true);
    });

    it("can sign typed data", async () => {
      const signature = await smartAccount.signTypedData(typedData.basic);
      const isValid = await verifyTypedData({
        address: smartWalletAddress,
        chain,
        client,
        signature,
        ...typedData.basic,
      });
      expect(isValid).toEqual(true);
    });

    it("should send a transaction", async () => {
      const tx = prepareTransaction({
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });

      const receipt = await sendTransaction({
        account: smartAccount,
        transaction: tx,
      });
      expect(receipt.transactionHash).toBeDefined();

      await confirmContractDeployment({
        accountContract,
      });
    });

    it("should send a batch transaction", async () => {
      const tx = prepareTransaction({
        chain,
        client,
        to: smartAccount.address,
        value: 0n,
      });

      const tx2 = prepareTransaction({
        chain,
        client,
        to: TEST_ACCOUNT_A.address,
        value: 0n,
      });

      const receipt = await sendBatchTransaction({
        account: smartAccount,
        transactions: [tx, tx2],
      });
      expect(receipt.transactionHash).toBeDefined();
    });
  },
);
