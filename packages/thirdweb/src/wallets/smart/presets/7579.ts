import * as ox__AbiParameters from "ox/AbiParameters";
import * as ox__Hex from "ox/Hex";
import { serializeErc6492Signature } from "../../../auth/serialize-erc6492-signature.js";
import { verifyHash } from "../../../auth/verify-hash.js";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { getNonce } from "../../../extensions/erc4337/__generated__/IEntryPoint/read/getNonce.js";
import { execute } from "../../../extensions/erc7579/__generated__/IERC7579Account/write/execute.js";
import { createAccountWithModules } from "../../../extensions/erc7579/__generated__/ModularAccountFactory/write/createAccountWithModules.js";
import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { readContract } from "../../../transaction/read-contract.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { getAddress } from "../../../utils/address.js";
import { hashMessage } from "../../../utils/hashing/hashMessage.js";
import { hashTypedData } from "../../../utils/hashing/hashTypedData.js";
import type { Account } from "../../interfaces/wallet.js";
import { ENTRYPOINT_ADDRESS_v0_7 } from "../lib/constants.js";
import { generateRandomUint192 } from "../lib/utils.js";
import type { SmartWalletOptions } from "../types.js";

export type ERC7579Config = SmartWalletOptions & {
  validatorAddress: string;
  factoryAddress: string;
};

/**
 * Config for a ERC7579 modular smart wallet.
 *
 * This configuration is in BETA, expect breaking changes.
 *
 * @param options - Optional overrides for the smart wallet.
 * @returns The smart wallet options.
 *
 * @example
 * ```typescript
 * import { sepolia } from "thirdweb/chains";
 * import { smartWallet, Config } from "thirdweb/wallets/smart";
 *
 * const modularSmartWallet = smartWallet(
 *   Config.erc7579({
 *     chain: sepolia,
 *     sponsorGas: true,
 *     factoryAddress: "0x...", // the 7579 factory address
 *     validatorAddress: "0x...", // the default validator module address
 *   }),
 * });
 * ```
 *
 * @wallet
 * @extension ERC7579
 * @beta
 */
export function erc7579(options: ERC7579Config): SmartWalletOptions {
  const saltHex =
    options.overrides?.accountSalt &&
    ox__Hex.validate(options.overrides.accountSalt)
      ? options.overrides.accountSalt
      : ox__Hex.fromString(options.overrides?.accountSalt ?? "");
  const defaultValidator = getAddress(options.validatorAddress);
  const modularAccountOptions: SmartWalletOptions = {
    ...options,
    factoryAddress: options.factoryAddress,
    overrides: {
      createAccount(factoryContract, admin) {
        // TODO (msa) - let ppl pass whatever modules they want here
        return createAccountWithModules({
          asyncParams: async () => {
            // default validator
            const modules = [
              {
                initData: ox__Hex.fromString(""), // validator type id
                module: defaultValidator,
                moduleTypeId: 1n,
              },
            ];
            return {
              modules,
              owner: admin,
              salt: saltHex,
            };
          },
          contract: factoryContract,
        });
      },
      entrypointAddress: ENTRYPOINT_ADDRESS_v0_7,
      execute(accountContract, transaction) {
        return execute({
          async asyncParams() {
            return {
              executionCalldata: ox__AbiParameters.encodePacked(
                ["address", "uint256", "bytes"],
                [
                  transaction.to || ZERO_ADDRESS,
                  transaction.value || 0n,
                  transaction.data || "0x",
                ],
              ), // single execution
              mode: ox__Hex.padRight("0x00", 32),
            };
          },
          contract: accountContract,
        });
      },
      executeBatch(accountContract, transactions) {
        return execute({
          async asyncParams() {
            return {
              executionCalldata: ox__AbiParameters.encode(
                [
                  {
                    components: [
                      { name: "to", type: "address" },
                      { name: "value", type: "uint256" },
                      { name: "data", type: "bytes" },
                    ],
                    type: "tuple[]",
                  },
                ],
                [
                  transactions.map((t) => ({
                    data: t.data || "0x",
                    to: t.to || ZERO_ADDRESS,
                    value: t.value || 0n,
                  })),
                ],
              ), // batch execution
              mode: ox__Hex.padRight("0x01", 32),
            };
          },
          contract: accountContract,
        });
      },
      async getAccountNonce(accountContract) {
        const entryPointNonce = await getNonce({
          contract: getContract({
            address: ENTRYPOINT_ADDRESS_v0_7,
            chain: accountContract.chain,
            client: accountContract.client,
          }),
          key: generateRandomUint192(),
          sender: accountContract.address,
        });
        // TODO (msa) - could be different if validator for the deployed account is different
        const withValidator = ox__Hex.from(
          `${defaultValidator}${ox__Hex.fromNumber(entryPointNonce).slice(42)}`,
        );
        return ox__Hex.toBigInt(withValidator);
      },
      async predictAddress(factoryContract, admin) {
        return readContract({
          contract: factoryContract,
          method:
            "function getAddress(address owner, bytes salt) returns (address)",
          params: [admin, saltHex],
        });
      },
      async signMessage(options) {
        const { accountContract, factoryContract, adminAccount, message } =
          options;
        const originalMsgHash = hashMessage(message);
        const createAccount = modularAccountOptions.overrides?.createAccount;
        if (!createAccount) {
          throw new Error("Create account override not provided");
        }
        return generateSignature({
          accountContract,
          adminAccount,
          createAccount,
          defaultValidator,
          factoryContract,
          originalMsgHash,
        });
      },
      async signTypedData(options) {
        const { accountContract, factoryContract, adminAccount, typedData } =
          options;
        const originalMsgHash = hashTypedData(typedData);
        const createAccount = modularAccountOptions.overrides?.createAccount;
        if (!createAccount) {
          throw new Error("Create account override not provided");
        }
        return generateSignature({
          accountContract,
          adminAccount,
          createAccount,
          defaultValidator,
          factoryContract,
          originalMsgHash,
        });
      },
      ...options.overrides,
    },
  };
  return modularAccountOptions;
}

async function generateSignature(options: {
  accountContract: ThirdwebContract;
  factoryContract: ThirdwebContract;
  adminAccount: Account;
  originalMsgHash: ox__Hex.Hex;
  defaultValidator: string;
  createAccount: (
    factoryContract: ThirdwebContract,
    admin: string,
  ) => PreparedTransaction;
}) {
  const {
    accountContract,
    factoryContract,
    adminAccount,
    originalMsgHash,
    defaultValidator,
    createAccount,
  } = options;
  const wrappedMessageHash = encodeAbiParameters(
    [{ type: "bytes32" }],
    [originalMsgHash],
  );

  const rawSig = await adminAccount.signTypedData({
    domain: {
      chainId: accountContract.chain.id,
      // TODO (msa) - assumes our default validator here
      name: "DefaultValidator",
      verifyingContract: defaultValidator,
      version: "1",
    },
    message: { message: wrappedMessageHash },
    primaryType: "AccountMessage",
    types: { AccountMessage: [{ name: "message", type: "bytes" }] },
  });

  // add the validator address to the signature
  const sig = encodeAbiParameters(
    [{ type: "address" }, { type: "bytes" }],
    [defaultValidator, rawSig],
  );

  const deployTx = createAccount(factoryContract, adminAccount.address);
  if (!deployTx) {
    throw new Error("Create account override not provided");
  }
  const initCode = await encode(deployTx);
  const erc6492Sig = serializeErc6492Signature({
    address: factoryContract.address,
    data: initCode,
    signature: sig,
  });

  // check if the signature is valid
  const isValid = await verifyHash({
    address: accountContract.address,
    chain: accountContract.chain,
    client: accountContract.client,
    hash: originalMsgHash,
    signature: erc6492Sig,
  });

  if (!isValid) {
    throw new Error(
      `Something went wrong generating the signature for modular smart account: ${accountContract.address} on chain ${accountContract.chain.id}`,
    );
  }
  return erc6492Sig;
}
