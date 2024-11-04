import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { sepolia } from "../../chains/chain-definitions/sepolia.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import type { Address } from "../../utils/address.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { generateAccount } from "../utils/generateAccount.js";
import { smartWallet } from "./smart-wallet.js";

let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: Address;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = sepolia;
const client = TEST_CLIENT;
const factoryAddress = "0xbE648d62571AcEAaBBEb1Ea35d99fBbdbC262B58";

describe.runIf(process.env.TW_SECRET_KEY).sequential(
  "SmartWallet policy tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      personalAccount = await generateAccount({
        client,
      });
      wallet = smartWallet({
        chain,
        gasless: true,
        factoryAddress,
      });
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

      // const d = decodeErrorResult({
      //   data: "0x79bd117bb61d27f600000000000000000000000000000000000000000000000000000000",
      //   abi: await resolveContractAbi({
      //     address: ENTRYPOINT_ADDRESS_v0_7,
      //     client,
      //     chain,
      //   }),
      // });
      // console.log(d);
    });

    it("can sign a msg", async () => {
      await smartAccount.signMessage({ message: "hello world" });
      const isDeployed = await isContractDeployed(accountContract);
      expect(isDeployed).toEqual(true);
    });

    it("should send a transaction", async () => {
      const tx = prepareTransaction({
        client,
        chain,
        to: smartAccount.address,
        value: 0n,
      });

      console.log("Sending transaction...");
      const receipt = await sendTransaction({
        transaction: tx,
        account: smartAccount,
      });
      console.log("Transaction sent:", receipt.transactionHash);
      expect(receipt.transactionHash).toBeDefined();
    });
  },
);
