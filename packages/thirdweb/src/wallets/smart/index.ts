import { numberToBytesBE } from "@noble/curves/abstract/utils";
import {
  type SignableMessage,
  type TypedData,
  type TypedDataDefinition,
  type TypedDataDomain,
  encodeAbiParameters,
  hashTypedData,
} from "viem";
import {
  type CreateCredentialReturnType,
  type Signature,
  bytesToHex,
  createCredential,
  sign,
} from "webauthn-p256";
import type { Chain } from "../../chains/types.js";
import { getCachedChain } from "../../chains/utils.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import type { WaitForReceiptOptions } from "../../transaction/actions/wait-for-tx-receipt.js";
import {
  populateEip712Transaction,
  signEip712Transaction,
} from "../../transaction/actions/zksync/send-eip712-transaction.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { readContract } from "../../transaction/read-contract.js";
import type { SendTransactionResult } from "../../transaction/types.js";
import { type Hex, hexToUint8Array } from "../../utils/encoding/hex.js";
import { stringify } from "../../utils/json.js";
import { parseTypedData } from "../../utils/signatures/helpers/parseTypedData.js";
import { webLocalStorage } from "../../utils/storage/webStorage.js";
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
import {
  DEFAULT_ACCOUNT_FACTORY,
  ENTRYPOINT_ADDRESS_v0_6,
} from "./lib/constants.js";
import {
  createUnsignedUserOp,
  getUserOpHash,
  signUserOp,
  waitForUserOpReceipt,
} from "./lib/userop.js";
import { isNativeAAChain } from "./lib/utils.js";
import type {
  SmartAccountOptions,
  SmartWalletConnectionOptions,
  SmartWalletOptions,
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
export const personalAccountToSmartAccountMap = new WeakMap<
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
  const factoryAddress = options.factoryAddress ?? DEFAULT_ACCOUNT_FACTORY;
  const chain = connectChain ?? options.chain;
  const sponsorGas =
    "gasless" in options ? options.gasless : options.sponsorGas;

  // FIXME testing passkey signer
  if (connectionOptions.passkeySigner) {
    return createPasskeyAccount({
      creationOptions,
      connectionOptions,
      chain,
      sponsorGas,
    });
  }

  if (isNativeAAChain(chain)) {
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
  const accountAddress = await predictAddress(factoryContract, {
    personalAccountAddress: personalAccount.address,
    ...options,
  })
    .then((address) => address)
    .catch((err) => {
      throw new Error(
        `Failed to get account address with factory contract ${factoryContract.address} on chain ID ${chain.id}. Are you on the right chain?`,
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
    address: accountContract.address,
    async sendTransaction(transaction: SendTransactionOption) {
      const executeTx = prepareExecute({
        accountContract,
        transaction,
        execute: options.overrides?.execute,
      });
      return _sendUserOp({
        executeTx,
        options,
      });
    },
    async sendBatchTransaction(transactions: SendTransactionOption[]) {
      const executeTx = prepareBatchExecute({
        accountContract,
        options,
        transactions,
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
      } catch (e) {
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
        console.log(
          "Account contract not deployed yet. Deploying account before signing message",
        );
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
      } catch (e) {
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

async function createPasskeyAccount(args: {
  creationOptions: SmartWalletOptions;
  connectionOptions: SmartWalletConnectionOptions;
  chain: Chain;
  sponsorGas: boolean;
}): Promise<[Account, Chain]> {
  const { creationOptions, connectionOptions, chain } = args;

  let predictedAddress: string | undefined = undefined;
  const factoryContract = getContract({
    address:
      creationOptions.factoryAddress ||
      "0x70A8F32FB4B97840Ea0008d098Ae38A4a572aA4A", // FIXME test factory
    chain,
    client: connectionOptions.client,
  });

  // create or request passkey credentials
  let credentials: CreateCredentialReturnType | undefined;

  // 1. login
  // retrieve pub key from local storage
  // predict address from pub key
  const storedCredentialsRaw = await webLocalStorage.getItem("passkey");
  const credentialsUnserialized = storedCredentialsRaw
    ? (JSON.parse(storedCredentialsRaw) as CreateCredentialReturnType)
    : undefined;
  credentials = credentialsUnserialized
    ? {
        id: credentialsUnserialized.id,
        publicKey: {
          x: BigInt(credentialsUnserialized.publicKey.x),
          y: BigInt(credentialsUnserialized.publicKey.y),
          prefix: credentialsUnserialized.publicKey.prefix,
        },
      }
    : undefined;

  console.log("stored credentials", credentials);

  // 2. creation
  // create new passkey w/ current domain
  // get pub key => predict address with getAddress()
  // store pub key (WHERE THOUGH?) - local storage is not enough
  if (!credentials) {
    credentials = await createCredential({ name: "p256test" });
    await webLocalStorage.setItem("passkey", stringify(credentials));
  }

  let pubkey: Hex | undefined;

  if (credentials) {
    pubkey = encodeAbiParameters(
      [
        { name: "x", type: "uint256" },
        { name: "y", type: "uint256" },
      ],
      [credentials.publicKey.x, credentials.publicKey.y],
    );
    console.log("pubkey length", hexToUint8Array(pubkey).length);
  }

  if (credentials && pubkey) {
    predictedAddress = await predictAddress(factoryContract, {
      ...creationOptions,
      overrides: {
        predictAddress: async (contract) => {
          return readContract({
            contract,
            method:
              "function getAddress(bytes[] calldata owners, uint256 nonce) external view returns (address)",
            params: [[pubkey], 0n],
          });
        },
      },
    });
  }

  if (!predictedAddress) {
    throw new Error("Failed to predict address from passkey credentials");
  }

  const accountContract = getContract({
    address: predictedAddress,
    chain,
    client: connectionOptions.client,
  });

  const account: Account = {
    address: predictedAddress, // TODO async call to get the address based off
    async sendTransaction(
      transaction: SendTransactionOption,
    ): Promise<SendTransactionResult> {
      // 3. send tx
      // retrieve pubkey from local storage
      // use pubkey for initCode (needed for createAccount())
      // hash the userOp (unsigned)
      // hash becomes the challenge to sign with passkey
      // add signature to userOp
      // send to bundler
      const executeTx = prepareExecute({
        accountContract,
        execute: creationOptions.overrides?.execute,
        transaction,
      });

      if (!credentials || !pubkey) {
        throw new Error("Failed to retrieve credentials or pubkey");
      }

      const options: SmartAccountOptions = {
        ...creationOptions,
        accountContract,
        client: connectionOptions.client,
        chain,
        factoryContract,
        sponsorGas: false, // FIXME
        personalAccount: account, // FIXME
        overrides: {
          createAccount: (contract) => {
            return prepareContractCall({
              contract,
              method:
                "function createAccount(bytes[] calldata owners, uint256 nonce)",
              params: [[pubkey], 0n],
            });
          },
        },
      };

      const userOp = await createUnsignedUserOp({
        options,
        transaction: executeTx,
      });
      const unsignedUserOpHash = getUserOpHash({
        userOp,
        entryPoint:
          creationOptions.overrides?.entrypointAddress ||
          ENTRYPOINT_ADDRESS_v0_6,
        chainId: creationOptions.chain.id,
      });

      console.log("unsignedUserOpHash", unsignedUserOpHash);

      const sig = await sign({
        credentialId: credentials.id,
        hash: unsignedUserOpHash,
      });

      console.log("sigData", sig);

      const sigData = encodeAbiParameters(
        [
          {
            name: "signature",
            type: "tuple",
            internalType: "struct WebAuthn.WebAuthnAuth",
            components: [
              {
                name: "authenticatorData",
                type: "bytes",
                internalType: "bytes",
              },
              {
                name: "clientDataJSON",
                type: "string",
                internalType: "string",
              },
              {
                name: "challengeIndex",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "typeIndex", type: "uint256", internalType: "uint256" },
              { name: "r", type: "uint256", internalType: "uint256" },
              { name: "s", type: "uint256", internalType: "uint256" },
            ],
          },
        ],
        [{ ...sig.webauthn, ...sig.signature }],
      );

      const signature = encodeAbiParameters(
        [
          { name: "ownerId", type: "uint256" },
          { name: "signature", type: "bytes" },
        ],
        [0n, sigData],
      );

      const userOpHash = await bundleUserOp({
        options,
        userOp: {
          ...userOp,
          signature,
        },
      });
      // wait for tx receipt rather than return the userOp hash
      const receipt = await waitForUserOpReceipt({
        ...options,
        userOpHash,
      });

      return {
        transactionHash: receipt.transactionHash,
      };
    },
    async signMessage({
      message,
    }: { message: SignableMessage }): Promise<`0x${string}`> {
      void message;
      throw new Error("Function not implemented.");
    },
    async signTypedData<
      const typedData extends TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(_typedData: TypedDataDefinition<typedData, primaryType>) {
      throw new Error("Function not implemented.");
    },
  };
  return [account, chain];
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
            overrides: creationOptions.overrides,
            chain,
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
          overrides: creationOptions.overrides,
          chain,
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
    options,
  });
  const signedUserOp = await signUserOp({
    options,
    userOp: unsignedUserOp,
  });
  const userOpHash = await bundleUserOp({
    options,
    userOp: signedUserOp,
  });
  // wait for tx receipt rather than return the userOp hash
  const receipt = await waitForUserOpReceipt({
    ...options,
    userOpHash,
  });

  return {
    client: options.client,
    chain: options.chain,
    transactionHash: receipt.transactionHash,
  };
}

export function serializeSignature(signature: Signature): Hex {
  const result = new Uint8Array([
    ...numberToBytesBE(signature.r, 32),
    ...numberToBytesBE(signature.s, 32),
  ]);
  return bytesToHex(result);
}
