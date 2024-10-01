import {
  type SignableMessage,
  type TypedData,
  type TypedDataDefinition,
  type TypedDataDomain,
  hashTypedData,
  maxUint96,
} from "viem";
import type { Chain } from "../../chains/types.js";
import { getCachedChain } from "../../chains/utils.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { allowance } from "../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import { approve } from "../../extensions/erc20/write/approve.js";
import { toSerializableTransaction } from "../../transaction/actions/to-serializable-transaction.js";
import type { WaitForReceiptOptions } from "../../transaction/actions/wait-for-tx-receipt.js";
import {
  populateEip712Transaction,
  signEip712Transaction,
} from "../../transaction/actions/zksync/send-eip712-transaction.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { getAddress } from "../../utils/address.js";
import { isZkSyncChain } from "../../utils/any-evm/zksync/isZkSyncChain.js";
import { concatHex } from "../../utils/encoding/helpers/concat-hex.js";
import type { Hex } from "../../utils/encoding/hex.js";
import { parseTypedData } from "../../utils/signatures/helpers/parseTypedData.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type {
  CreateWalletArgs,
  WalletConnectionOption,
  WalletId,
} from "../wallet-types.js";
import {
  broadcastZkTransaction,
  bundleUserOp,
  getZkPaymasterData,
} from "./lib/bundler.js";
import {
  predictAddress,
  prepareBatchExecute,
  prepareExecute,
} from "./lib/calls.js";
import { getDefaultAccountFactory } from "./lib/constants.js";
import {
  clearAccountDeploying,
  createUnsignedUserOp,
  signUserOp,
  waitForUserOpReceipt,
} from "./lib/userop.js";
import type {
  BundlerOptions,
  PaymasterResult,
  SmartAccountOptions,
  SmartWalletConnectionOptions,
  SmartWalletOptions,
  UserOperationV06,
  UserOperationV07,
} from "./types.js";
/**
 * Checks if the provided wallet is a smart wallet.
 *
 * @param wallet - The wallet to check.
 * @returns True if the wallet is a smart wallet, false otherwise.
 */
export function isSmartWallet(
  wallet: Wallet<WalletId>,
): wallet is Wallet<"smart"> {
  return wallet.id === "smart";
}

/**
 * We can get the personal account for given smart account but not the other way around - this map gives us the reverse lookup
 * @internal
 */
const personalAccountToSmartAccountMap = new WeakMap<
  Account,
  Wallet<"smart">
>();

const smartWalletToPersonalAccountMap = new WeakMap<Wallet<"smart">, Account>();

/**
 * @internal
 */
export async function connectSmartWallet(
  wallet: Wallet<"smart">,
  connectionOptions: WalletConnectionOption<"smart">,
  creationOptions: CreateWalletArgs<"smart">[1],
): Promise<[Account, Chain]> {
  const { personalAccount, client, chain: connectChain } = connectionOptions;

  if (!personalAccount) {
    throw new Error("Personal wallet does not have an account");
  }

  const options = creationOptions;
  const factoryAddress =
    options.factoryAddress ??
    getDefaultAccountFactory(creationOptions.overrides?.entrypointAddress);
  const chain = connectChain ?? options.chain;
  const sponsorGas =
    "gasless" in options ? options.gasless : options.sponsorGas;

  if (await isZkSyncChain(chain)) {
    return [
      createZkSyncAccount({
        creationOptions,
        connectionOptions,
        chain,
        sponsorGas,
      }),
      chain,
    ];
  }

  const factoryContract = getContract({
    client: client,
    address: factoryAddress,
    chain: chain,
  });

  // TODO: listen for chainChanged event on the personal wallet and emit the disconnect event on the smart wallet
  const accountAddress = await predictAddress({
    factoryContract,
    adminAddress: personalAccount.address,
    predictAddressOverride: options.overrides?.predictAddress,
    accountSalt: options.overrides?.accountSalt,
    accountAddress: options.overrides?.accountAddress,
  })
    .then((address) => address)
    .catch((err) => {
      throw new Error(
        `Failed to get account address with factory contract ${factoryContract.address} on chain ID ${chain.id}: ${err?.message || "unknown error"}`,
        { cause: err },
      );
    });

  const accountContract = getContract({
    client,
    address: accountAddress,
    chain,
  });

  const account = await createSmartAccount({
    ...options,
    chain,
    sponsorGas,
    personalAccount,
    accountContract,
    factoryContract,
    client,
  });

  personalAccountToSmartAccountMap.set(personalAccount, wallet);
  smartWalletToPersonalAccountMap.set(wallet, personalAccount);

  return [account, chain] as const;
}

/**
 * @internal
 */
export async function disconnectSmartWallet(
  wallet: Wallet<"smart">,
): Promise<void> {
  // look up the personalAccount for the smart wallet
  const personalAccount = smartWalletToPersonalAccountMap.get(wallet);
  if (personalAccount) {
    // remove the mappings
    personalAccountToSmartAccountMap.delete(personalAccount);
    smartWalletToPersonalAccountMap.delete(wallet);
  }
}

async function createSmartAccount(
  options: SmartAccountOptions,
): Promise<Account> {
  const { accountContract } = options;
  const account: Account = {
    address: getAddress(accountContract.address),
    async sendTransaction(transaction: SendTransactionOption) {
      // if erc20 paymaster - check allowance and approve if needed
      const erc20Paymaster = options.overrides?.erc20Paymaster;
      let paymasterOverride:
        | undefined
        | ((
            userOp: UserOperationV06 | UserOperationV07,
          ) => Promise<PaymasterResult>) = undefined;
      if (erc20Paymaster) {
        await approveERC20({
          accountContract,
          erc20Paymaster,
          options,
        });
        const paymasterCallback = async (): Promise<PaymasterResult> => {
          return {
            paymasterAndData: concatHex([
              erc20Paymaster.address as Hex,
              erc20Paymaster?.token as Hex,
            ]),
            // for 0.7 compatibility
            paymaster: erc20Paymaster.address as Hex,
            paymasterData: "0x",
          };
        };
        paymasterOverride = options.overrides?.paymaster || paymasterCallback;
      }
      const executeTx = prepareExecute({
        accountContract,
        transaction,
        executeOverride: options.overrides?.execute,
      });
      return _sendUserOp({
        executeTx,
        options: {
          ...options,
          overrides: {
            ...options.overrides,
            paymaster: paymasterOverride,
          },
        },
      });
    },
    async sendBatchTransaction(transactions: SendTransactionOption[]) {
      const executeTx = prepareBatchExecute({
        accountContract,
        transactions,
        executeBatchOverride: options.overrides?.executeBatch,
      });
      return _sendUserOp({
        executeTx,
        options,
      });
    },
    async signMessage({ message }: { message: SignableMessage }) {
      const [
        { isContractDeployed },
        { readContract },
        { encodeAbiParameters },
        { hashMessage },
        { checkContractWalletSignature },
      ] = await Promise.all([
        import("../../utils/bytecode/is-contract-deployed.js"),
        import("../../transaction/read-contract.js"),
        import("../../utils/abi/encodeAbiParameters.js"),
        import("../../utils/hashing/hashMessage.js"),
        import("../../extensions/erc1271/checkContractWalletSignature.js"),
      ]);
      const isDeployed = await isContractDeployed(accountContract);
      if (!isDeployed) {
        await _deployAccount({
          options,
          account,
          accountContract,
        });
      }

      const originalMsgHash = hashMessage(message);
      // check if the account contract supports EIP721 domain separator based signing
      let factorySupports712 = false;
      try {
        // this will throw if the contract does not support it (old factories)
        await readContract({
          contract: accountContract,
          method:
            "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
          params: [originalMsgHash],
        });
        factorySupports712 = true;
      } catch {
        // ignore
      }

      let sig: `0x${string}`;
      if (factorySupports712) {
        const wrappedMessageHash = encodeAbiParameters(
          [{ type: "bytes32" }],
          [originalMsgHash],
        );
        sig = await options.personalAccount.signTypedData({
          domain: {
            name: "Account",
            version: "1",
            chainId: options.chain.id,
            verifyingContract: accountContract.address,
          },
          primaryType: "AccountMessage",
          types: { AccountMessage: [{ name: "message", type: "bytes" }] },
          message: { message: wrappedMessageHash },
        });
      } else {
        sig = await options.personalAccount.signMessage({ message });
      }

      const isValid = await checkContractWalletSignature({
        contract: accountContract,
        message,
        signature: sig,
      });

      if (isValid) {
        return sig;
      }
      throw new Error(
        "Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.",
      );
    },
    async signTypedData<
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(_typedData: TypedDataDefinition<typedData, primaryType>) {
      const typedData = parseTypedData(_typedData);
      const [
        { isContractDeployed },
        { readContract },
        { encodeAbiParameters },
        { checkContractWalletSignedTypedData },
      ] = await Promise.all([
        import("../../utils/bytecode/is-contract-deployed.js"),
        import("../../transaction/read-contract.js"),
        import("../../utils/abi/encodeAbiParameters.js"),
        import(
          "../../extensions/erc1271/checkContractWalletSignedTypedData.js"
        ),
      ]);
      const isSelfVerifyingContract =
        (
          typedData.domain as TypedDataDomain
        )?.verifyingContract?.toLowerCase() ===
        accountContract.address?.toLowerCase();

      if (isSelfVerifyingContract) {
        // if the contract is self-verifying, we can just sign the message with the EOA (ie. adding a session key)
        return options.personalAccount.signTypedData(typedData);
      }

      const isDeployed = await isContractDeployed(accountContract);
      if (!isDeployed) {
        await _deployAccount({
          options,
          account,
          accountContract,
        });
      }

      const originalMsgHash = hashTypedData(typedData);
      // check if the account contract supports EIP721 domain separator based signing
      let factorySupports712 = false;
      try {
        // this will throw if the contract does not support it (old factories)
        await readContract({
          contract: accountContract,
          method:
            "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
          params: [originalMsgHash],
        });
        factorySupports712 = true;
      } catch {
        // ignore
      }

      let sig: `0x${string}`;
      if (factorySupports712) {
        const wrappedMessageHash = encodeAbiParameters(
          [{ type: "bytes32" }],
          [originalMsgHash],
        );
        sig = await options.personalAccount.signTypedData({
          domain: {
            name: "Account",
            version: "1",
            chainId: options.chain.id,
            verifyingContract: accountContract.address,
          },
          primaryType: "AccountMessage",
          types: { AccountMessage: [{ name: "message", type: "bytes" }] },
          message: { message: wrappedMessageHash },
        });
      } else {
        sig = await options.personalAccount.signTypedData(typedData);
      }

      const isValid = await checkContractWalletSignedTypedData({
        contract: accountContract,
        data: typedData,
        signature: sig,
      });

      if (isValid) {
        return sig;
      }
      throw new Error(
        "Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.",
      );
    },
    async onTransactionRequested(transaction) {
      return options.personalAccount.onTransactionRequested?.(transaction);
    },
  };
  return account;
}

async function approveERC20(args: {
  accountContract: ThirdwebContract;
  options: SmartAccountOptions;
  erc20Paymaster: {
    address: string;
    token: string;
  };
}) {
  const { accountContract, erc20Paymaster, options } = args;
  const tokenAddress = erc20Paymaster.token;
  const tokenContract = getContract({
    address: tokenAddress,
    chain: accountContract.chain,
    client: accountContract.client,
  });
  const accountAllowance = await allowance({
    contract: tokenContract,
    owner: accountContract.address,
    spender: erc20Paymaster.address,
  });

  if (accountAllowance > 0n) {
    return;
  }

  const approveTx = approve({
    contract: tokenContract,
    spender: erc20Paymaster.address,
    amountWei: maxUint96 - 1n,
  });
  const transaction = await toSerializableTransaction({
    transaction: approveTx,
    from: accountContract.address,
  });
  const executeTx = prepareExecute({
    accountContract,
    transaction,
    executeOverride: options.overrides?.execute,
  });
  await _sendUserOp({
    executeTx,
    options: {
      ...options,
      overrides: {
        ...options.overrides,
        erc20Paymaster: undefined,
      },
    },
  });
}

function createZkSyncAccount(args: {
  creationOptions: SmartWalletOptions;
  connectionOptions: SmartWalletConnectionOptions;
  chain: Chain;
  sponsorGas: boolean;
}): Account {
  const { creationOptions, connectionOptions, chain } = args;
  const account: Account = {
    address: connectionOptions.personalAccount.address,
    async sendTransaction(transaction: SendTransactionOption) {
      // override passed tx, we have to refetch gas and fees always
      const prepTx = {
        data: transaction.data,
        to: transaction.to ?? undefined,
        value: transaction.value ?? 0n,
        chain: getCachedChain(transaction.chainId),
        client: connectionOptions.client,
      };

      let serializableTransaction = await populateEip712Transaction({
        account,
        transaction: prepTx,
      });

      if (args.sponsorGas) {
        // get paymaster input
        const pmData = await getZkPaymasterData({
          options: {
            client: connectionOptions.client,
            chain,
            bundlerUrl: creationOptions.overrides?.bundlerUrl,
            entrypointAddress: creationOptions.overrides?.entrypointAddress,
          },
          transaction: serializableTransaction,
        });
        serializableTransaction = {
          ...serializableTransaction,
          ...pmData,
        };
      }

      // sign
      const signedTransaction = await signEip712Transaction({
        account,
        chainId: chain.id,
        eip712Transaction: serializableTransaction,
      });

      // broadcast via bundler
      const txHash = await broadcastZkTransaction({
        options: {
          client: connectionOptions.client,
          chain,
          bundlerUrl: creationOptions.overrides?.bundlerUrl,
          entrypointAddress: creationOptions.overrides?.entrypointAddress,
        },
        transaction: serializableTransaction,
        signedTransaction,
      });
      return {
        transactionHash: txHash.transactionHash,
        client: connectionOptions.client,
        chain: chain,
      };
    },
    async signMessage({ message }: { message: SignableMessage }) {
      return connectionOptions.personalAccount.signMessage({ message });
    },
    async signTypedData<
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(_typedData: TypedDataDefinition<typedData, primaryType>) {
      const typedData = parseTypedData(_typedData);
      return connectionOptions.personalAccount.signTypedData(typedData);
    },
    async onTransactionRequested(transaction) {
      return connectionOptions.personalAccount.onTransactionRequested?.(
        transaction,
      );
    },
  };
  return account;
}

async function _deployAccount(args: {
  options: SmartAccountOptions;
  account: Account;
  accountContract: ThirdwebContract;
}) {
  const { options, account, accountContract } = args;
  const [{ sendTransaction }, { prepareTransaction }] = await Promise.all([
    import("../../transaction/actions/send-transaction.js"),
    import("../../transaction/prepare-transaction.js"),
  ]);
  const dummyTx = prepareTransaction({
    client: options.client,
    chain: options.chain,
    to: accountContract.address,
    value: 0n,
    gas: 50000n, // force gas to avoid simulation error
  });
  const deployResult = await sendTransaction({
    transaction: dummyTx,
    account,
  });
  return deployResult;
}

async function _sendUserOp(args: {
  executeTx: PreparedTransaction;
  options: SmartAccountOptions;
}): Promise<WaitForReceiptOptions> {
  const { executeTx, options } = args;
  const unsignedUserOp = await createUnsignedUserOp({
    transaction: executeTx,
    factoryContract: options.factoryContract,
    accountContract: options.accountContract,
    adminAddress: options.personalAccount.address,
    sponsorGas: options.sponsorGas,
    overrides: options.overrides,
  });
  const signedUserOp = await signUserOp({
    client: options.client,
    chain: options.chain,
    adminAccount: options.personalAccount,
    entrypointAddress: options.overrides?.entrypointAddress,
    userOp: unsignedUserOp,
  });
  const bundlerOptions: BundlerOptions = {
    chain: options.chain,
    client: options.client,
    bundlerUrl: options.overrides?.bundlerUrl,
    entrypointAddress: options.overrides?.entrypointAddress,
  };
  const userOpHash = await bundleUserOp({
    options: bundlerOptions,
    userOp: signedUserOp,
  });
  // wait for tx receipt rather than return the userOp hash
  const receipt = await waitForUserOpReceipt({
    ...options,
    userOpHash,
  });

  // reset the isDeploying flag after every transaction
  clearAccountDeploying(options.accountContract);

  return {
    client: options.client,
    chain: options.chain,
    transactionHash: receipt.transactionHash,
  };
}
