import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { encodeSingleInitMSA } from "../../extensions/erc7579/__generated__/Bootstrap/write/singleInitMSA.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import { prepareTransaction } from "../../transaction/prepare-transaction.js";
import { readContract } from "../../transaction/read-contract.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { type Address, getAddress } from "../../utils/address.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { keccak256 } from "../../utils/hashing/keccak256.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { ENTRYPOINT_ADDRESS_v0_7 } from "./lib/constants.js";
import { smartWallet } from "./smart-wallet.js";
let wallet: Wallet;
let smartAccount: Account;
let smartWalletAddress: Address;
let personalAccount: Account;
let accountContract: ThirdwebContract;

const chain = baseSepolia;
const client = TEST_CLIENT;
const factoryAddress = "0xC7c2a0aC7334f84bAe0EB1c4e42526FB6ea2e661"; // reference implementation
// const factoryAddress = "0xbE648d62571AcEAaBBEb1Ea35d99fBbdbC262B58";

describe.runIf(process.env.TW_SECRET_KEY).sequential(
  "SmartWallet policy tests",
  {
    retry: 0,
    timeout: 240_000,
  },
  () => {
    beforeAll(async () => {
      personalAccount = TEST_ACCOUNT_A;
      // personalAccount = await generateAccount({
      //   client,
      //  });
      wallet = smartWallet({
        chain,
        gasless: true,
        factoryAddress,
        overrides: {
          entrypointAddress: ENTRYPOINT_ADDRESS_v0_7,
          createAccount(factoryContract) {
            return prepareContractCall({
              contract: factoryContract,
              method: "function createAccount(bytes32 salt, bytes initCode)",
              params: [
                keccak256(getAddress(personalAccount.address)),
                encodeAbiParameters(
                  [{ type: "address" }, { type: "bytes" }],
                  [
                    "0x1E919660050C68BFEf868945Cf5f9a26ad7E360b", // bootstrap
                    encodeSingleInitMSA({
                      validator: "0x11D02847245Df7cF19f48C8907ace59289D8aCEe", // mock validator
                      data: "0x",
                    }),
                  ],
                ),
              ],
            });
          },
          async predictAddress(factoryContract) {
            return readContract({
              contract: factoryContract,
              method:
                "function getAddress(bytes32 salt, bytes initCode) returns (address)",
              params: [
                keccak256(getAddress(personalAccount.address)),
                encodeAbiParameters(
                  [{ type: "address" }, { type: "bytes" }],
                  [
                    "0x1E919660050C68BFEf868945Cf5f9a26ad7E360b", // bootstrap
                    encodeSingleInitMSA({
                      validator: "0x11D02847245Df7cF19f48C8907ace59289D8aCEe", // mock validator
                      data: "0x",
                    }),
                  ],
                ),
              ],
            });
          },
        },
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
      //   data: "0xb927fe5e0000000000000000000000000000000000000000db72e07d8a92f3d9d30e3843",
      //   abi: await resolveContractAbi({
      //     address: smartWalletAddress,
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
