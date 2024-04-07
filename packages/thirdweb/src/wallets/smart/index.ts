import type { SignableMessage } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import type { WaitForReceiptOptions } from "../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../transaction/types.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type {
  CreateWalletArgs,
  WalletConnectionOption,
} from "../wallet-types.js";
import { bundleUserOp, getUserOpReceipt } from "./lib/bundler.js";
import {
  predictAddress,
  prepareBatchExecute,
  prepareExecute,
} from "./lib/calls.js";
import { createUnsignedUserOp, signUserOp } from "./lib/userop.js";
import type { SmartWalletOptions } from "./types.js";

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
  const chain = connectChain ?? options.chain;
  const factoryAddress = options.factoryAddress;

  const factoryContract = getContract({
    client: client,
    address: factoryAddress,
    chain: chain,
  });

  // TODO: listen for chainChanged event on the personal wallet and emit the disconnect event on the smart wallet
  const accountAddress = await predictAddress(factoryContract, {
    personalAccountAddress: personalAccount.address,
    ...options,
  });

  const accountContract = getContract({
    client,
    address: accountAddress,
    chain,
  });

  const account = await createSmartAccount({
    ...options,
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
  options: SmartWalletOptions & {
    personalAccount: Account;
    factoryContract: ThirdwebContract;
    accountContract: ThirdwebContract;
    client: ThirdwebClient;
  },
): Promise<Account> {
  const { accountContract, factoryContract } = options;
  const account = {
    address: accountContract.address,
    async sendTransaction(transaction: SendTransactionOption) {
      const executeTx = prepareExecute({
        accountContract,
        options,
        transaction,
      });
      return _sendUserOp({
        factoryContract,
        accountContract,
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
        factoryContract,
        accountContract,
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
        console.log(
          "Account contract not deployed yet. Deploying account before signing message",
        );
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
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
    async signTypedData(typedData: any) {
      return options.personalAccount.signTypedData(typedData);
    },
    async estimateGas(tx: PreparedTransaction): Promise<bigint> {
      void tx; // linter
      return 0n;
    },
  };
  return account;
}

async function _deployAccount(args: {
  options: SmartWalletOptions & { client: ThirdwebClient };
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
  });
  const deployResult = await sendTransaction({
    transaction: dummyTx,
    account,
  });
  return deployResult;
}

async function _sendUserOp(args: {
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  executeTx: PreparedTransaction;
  options: SmartWalletOptions & {
    personalAccount: Account;
    client: ThirdwebClient;
  };
}): Promise<WaitForReceiptOptions> {
  const { factoryContract, accountContract, executeTx, options } = args;
  const unsignedUserOp = await createUnsignedUserOp({
    factoryContract,
    accountContract,
    executeTx,
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
    options,
    userOpHash,
  });

  return {
    client: options.client,
    chain: options.chain,
    transactionHash: receipt.transactionHash,
  };
}

async function waitForUserOpReceipt(args: {
  options: SmartWalletOptions & {
    personalAccount: Account;
    client: ThirdwebClient;
  };
  userOpHash: Hex;
}): Promise<TransactionReceipt> {
  const { options, userOpHash } = args;
  const timeout = 30000;
  const interval = 1000;
  const endtime = Date.now() + timeout;
  while (Date.now() < endtime) {
    const userOpReceipt = await getUserOpReceipt({ options, userOpHash });
    if (userOpReceipt) {
      return userOpReceipt;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Timeout waiting for userOp to be mined");
}
