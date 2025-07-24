import type * as ox__TypedData from "ox/TypedData";
import { serializeErc6492Signature } from "../../../auth/serialize-erc6492-signature.js";
import { verifyEip1271Signature } from "../../../auth/verify-hash.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { encode } from "../../../transaction/actions/encode.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { hashMessage } from "../../../utils/hashing/hashMessage.js";
import { hashTypedData } from "../../../utils/hashing/hashTypedData.js";
import type { SignableMessage } from "../../../utils/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { SmartAccountOptions } from "../types.js";
import { prepareCreateAccount } from "./calls.js";

/**
 * If the account is already deployed, generate an ERC-1271 signature.
 * If the account is not deployed, generate an ERC-6492 signature unless otherwise specified.
 *
 * @internal
 */
export async function smartAccountSignMessage({
  accountContract,
  factoryContract,
  options,
  message,
}: {
  accountContract: ThirdwebContract;
  factoryContract: ThirdwebContract;
  options: SmartAccountOptions;
  message: SignableMessage;
}) {
  const originalMsgHash = hashMessage(message);

  let sig: `0x${string}`;
  const wrappedMessageHash = encodeAbiParameters(
    [{ type: "bytes32" }],
    [originalMsgHash],
  );

  sig = await options.personalAccount.signTypedData({
    domain: {
      chainId: options.chain.id,
      name: "Account",
      verifyingContract: accountContract.address,
      version: "1",
    },
    message: { message: wrappedMessageHash },
    primaryType: "AccountMessage",
    types: { AccountMessage: [{ name: "message", type: "bytes" }] },
  });

  const isDeployed = await isContractDeployed(accountContract);
  if (isDeployed) {
    const isValid = await verifyEip1271Signature({
      contract: accountContract,
      hash: originalMsgHash,
      signature: sig,
    });
    if (isValid) {
      return sig;
    }
    throw new Error("Failed to verify signature");
  } else {
    const deployTx = prepareCreateAccount({
      accountSalt: options.overrides?.accountSalt,
      adminAddress: options.personalAccount.address,
      createAccountOverride: options.overrides?.createAccount,
      factoryContract,
    });
    if (!deployTx) {
      throw new Error("Create account override not provided");
    }
    const initCode = await encode(deployTx);
    const erc6492Sig = serializeErc6492Signature({
      address: factoryContract.address,
      data: initCode,
      signature: sig,
    });

    return erc6492Sig;
  }
}

export async function smartAccountSignTypedData<
  const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>({
  accountContract,
  factoryContract,
  options,
  typedData,
}: {
  accountContract: ThirdwebContract;
  factoryContract: ThirdwebContract;
  options: SmartAccountOptions;
  typedData: ox__TypedData.Definition<typedData, primaryType>;
}) {
  const isSelfVerifyingContract =
    (
      typedData.domain as ox__TypedData.Domain
    )?.verifyingContract?.toLowerCase() ===
    accountContract.address?.toLowerCase();

  if (isSelfVerifyingContract) {
    // if the contract is self-verifying, we can just sign the message with the EOA (ie. adding a session key)
    return options.personalAccount.signTypedData(typedData);
  }

  const originalMsgHash = hashTypedData(typedData);

  let sig: `0x${string}`;
  const wrappedMessageHash = encodeAbiParameters(
    [{ type: "bytes32" }],
    [originalMsgHash],
  );
  sig = await options.personalAccount.signTypedData({
    domain: {
      chainId: options.chain.id,
      name: "Account",
      verifyingContract: accountContract.address,
      version: "1",
    },
    message: { message: wrappedMessageHash },
    primaryType: "AccountMessage",
    types: { AccountMessage: [{ name: "message", type: "bytes" }] },
  });

  const isDeployed = await isContractDeployed(accountContract);
  if (isDeployed) {
    const isValid = await verifyEip1271Signature({
      contract: accountContract,
      hash: originalMsgHash,
      signature: sig,
    });
    if (isValid) {
      return sig;
    }
    throw new Error("Failed to verify signature");
  } else {
    const deployTx = prepareCreateAccount({
      accountSalt: options.overrides?.accountSalt,
      adminAddress: options.personalAccount.address,
      createAccountOverride: options.overrides?.createAccount,
      factoryContract,
    });
    if (!deployTx) {
      throw new Error("Create account override not provided");
    }
    const initCode = await encode(deployTx);
    const erc6492Sig = serializeErc6492Signature({
      address: factoryContract.address,
      data: initCode,
      signature: sig,
    });

    return erc6492Sig;
  }
}

export async function confirmContractDeployment(args: {
  accountContract: ThirdwebContract;
}) {
  const { accountContract } = args;
  const startTime = Date.now();
  const timeout = 60000; // wait 1 minute max
  const { isContractDeployed } = await import(
    "../../../utils/bytecode/is-contract-deployed.js"
  );
  let isDeployed = await isContractDeployed(accountContract);
  while (!isDeployed) {
    if (Date.now() - startTime > timeout) {
      throw new Error(
        "Timeout: Smart account deployment not confirmed after 1 minute",
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    isDeployed = await isContractDeployed(accountContract);
  }
}

/**
 * Deployes a smart account via a dummy transaction. If the account is already deployed, this will do nothing.
 *
 * @param args - Arguments for the deployment.
 * @param args.smartAccount - The smart account to deploy.
 * @param args.chain - The chain to deploy on.
 * @param args.client - The client to use for the deployment.
 * @param args.accountContract - The account contract to deploy.
 *
 * @example
 * ```ts
 * import { deploySmartAccount } from "thirdweb";
 *
 * const account = await deploySmartAccount({
 *   smartAccount,
 *   chain,
 *   client,
 *   accountContract,
 * });
 * ```
 *
 * @wallet
 */
export async function deploySmartAccount(args: {
  smartAccount: Account;
  chain: Chain;
  client: ThirdwebClient;
  accountContract: ThirdwebContract;
}) {
  const { chain, client, smartAccount, accountContract } = args;
  const isDeployed = await isContractDeployed(accountContract);
  if (isDeployed) {
    return;
  }

  const [{ sendTransaction }, { prepareTransaction }] = await Promise.all([
    import("../../../transaction/actions/send-transaction.js"),
    import("../../../transaction/prepare-transaction.js"),
  ]);
  const dummyTx = prepareTransaction({
    chain: chain,
    client: client,
    gas: 50000n,
    to: accountContract.address,
    value: 0n, // force gas to avoid simulation error
  });
  const deployResult = await sendTransaction({
    account: smartAccount,
    transaction: dummyTx,
  });

  await confirmContractDeployment({
    accountContract,
  });

  return deployResult;
}
