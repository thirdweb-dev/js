import type {
  SignableMessage,
  TypedData,
  TypedDataDefinition,
  TypedDataDomain,
} from "viem";
import {
  verifyEip1271Signature,
  verifyHash,
} from "../../../auth/verify-hash.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { readContract } from "../../../transaction/read-contract.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { hashMessage } from "../../../utils/hashing/hashMessage.js";
import { hashTypedData } from "../../../utils/hashing/hashTypedData.js";
import type { Account } from "../../interfaces/wallet.js";
import type { SmartAccountOptions } from "../types.js";

export async function deployAndSignMessage({
  account,
  accountContract,
  options,
  message,
}: {
  account: Account;
  accountContract: ThirdwebContract;
  options: SmartAccountOptions;
  message: SignableMessage;
}) {
  const isDeployed = await isContractDeployed(accountContract);
  if (!isDeployed) {
    await _deployAccount({
      options,
      account,
      accountContract,
    });
    // the bundler and rpc might not be in sync, so while the bundler has a transaction hash for the deployment,
    // the rpc might not have it yet, so we wait until the rpc confirms the contract is deployed
    await confirmContractDeployment({
      accountContract,
    });
  }

  const originalMsgHash = hashMessage(message);
  // check if the account contract supports EIP721 domain separator or modular based signing
  const is712Factory = await readContract({
    contract: accountContract,
    method:
      "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
    params: [originalMsgHash],
  })
    .then((res) => res !== "0x")
    .catch(() => false);

  let sig: `0x${string}`;
  if (is712Factory) {
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

  const isValid = await verifyEip1271Signature({
    contract: accountContract,
    hash: originalMsgHash,
    signature: sig,
  });

  if (isValid) {
    return sig;
  }
  throw new Error(
    "Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.",
  );
}

export async function deployAndSignTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>({
  account,
  accountContract,
  options,
  typedData,
}: {
  account: Account;
  accountContract: ThirdwebContract;
  options: SmartAccountOptions;
  typedData: TypedDataDefinition<typedData, primaryType>;
}) {
  const isSelfVerifyingContract =
    (typedData.domain as TypedDataDomain)?.verifyingContract?.toLowerCase() ===
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
    // the bundler and rpc might not be in sync, so while the bundler has a transaction hash for the deployment,
    // the rpc might not have it yet, so we wait until the rpc confirms the contract is deployed
    await confirmContractDeployment({
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

  const isValid = await verifyHash({
    hash: originalMsgHash,
    signature: sig,
    address: accountContract.address,
    chain: options.chain,
    client: options.client,
  });

  if (isValid) {
    return sig;
  }
  throw new Error(
    "Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.",
  );
}

async function _deployAccount(args: {
  options: SmartAccountOptions;
  account: Account;
  accountContract: ThirdwebContract;
}) {
  const { options, account, accountContract } = args;
  const [{ sendTransaction }, { prepareTransaction }] = await Promise.all([
    import("../../../transaction/actions/send-transaction.js"),
    import("../../../transaction/prepare-transaction.js"),
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
