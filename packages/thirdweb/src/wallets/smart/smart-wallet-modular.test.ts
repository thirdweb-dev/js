import { Hex } from "ox";
import { encodePacked, stringToHex, toHex } from "viem";
import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { baseSepolia } from "../../chains/chain-definitions/base-sepolia.js";
import { ZERO_ADDRESS } from "../../constants/addresses.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { getNonce } from "../../extensions/erc4337/__generated__/IEntryPoint/read/getNonce.js";
import { encodeSingleInitMSA } from "../../extensions/erc7579/__generated__/Bootstrap/write/singleInitMSA.js";
import { execute } from "../../extensions/erc7579/__generated__/IERC7579Account/write/execute.js";
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
import { generateRandomUint192 } from "./lib/utils.js";
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
      const VALIDATOR_ADDRESS = "0x6DF8ea6FF6Ca55f367CDA45510CA40dC78993DEC";
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
                    "0xedd4503de72bac321dfeb65f1373d2def17403fc", // bootstrap
                    encodeSingleInitMSA({
                      validator: VALIDATOR_ADDRESS, // simple validator
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
                    "0xedd4503de72bac321dfeb65f1373d2def17403fc", // bootstrap
                    encodeSingleInitMSA({
                      validator: VALIDATOR_ADDRESS, // simple validator
                      data: "0x",
                    }),
                  ],
                ),
              ],
            });
          },
          execute(accountContract, transaction) {
            return execute({
              contract: accountContract,
              async asyncParams() {
                return {
                  mode: stringToHex("", { size: 32 }), // single execution
                  executionCalldata: encodePacked(
                    ["address", "uint256", "bytes"],
                    [
                      transaction.to || ZERO_ADDRESS,
                      transaction.value || 0n,
                      transaction.data || "0x",
                    ],
                  ),
                };
              },
            });
          },
          async getAccountNonce(accountContract) {
            const nonce = await getNonce({
              contract: getContract({
                address: ENTRYPOINT_ADDRESS_v0_7,
                chain,
                client,
              }),
              key: generateRandomUint192(),
              sender: accountContract.address,
            });
            // FIXME - only for modular accounts to pass validator in
            const withValidator = `${VALIDATOR_ADDRESS}${toHex(nonce).slice(42)}`;
            console.log("DEBUG withValidator", withValidator);
            console.log("DEBUG withValidator", withValidator.length);
            return Hex.toBigInt(withValidator as Hex.Hex);
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
      //   data: "0x48c9cedab61d27f600000000000000000000000000000000000000000000000000000000",
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
