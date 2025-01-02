import type * as ox__TypedData from "ox/TypedData";
import { serializeErc6492Signature } from "../../../auth/serialize-erc6492-signature.js";
import { verifyHash } from "../../../auth/verify-hash.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { encode } from "../../../transaction/actions/encode.js";
import { readContract } from "../../../transaction/read-contract.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { hashMessage } from "../../../utils/hashing/hashMessage.js";
import { hashTypedData } from "../../../utils/hashing/hashTypedData.js";
import type { SignableMessage } from "../../../utils/types.js";
import type { SmartAccountOptions } from "../types.js";
import { prepareCreateAccount } from "./calls.js";

export async function deployAndSignMessage({
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
  const is712Factory = await checkFor712Factory({
    factoryContract,
    accountContract,
    originalMsgHash,
  });

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

  const deployTx = prepareCreateAccount({
    factoryContract,
    adminAddress: options.personalAccount.address,
    accountSalt: options.overrides?.accountSalt,
    createAccountOverride: options.overrides?.createAccount,
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

  // check if the signature is valid
  const isValid = await verifyHash({
    hash: originalMsgHash,
    signature: erc6492Sig,
    address: accountContract.address,
    chain: accountContract.chain,
    client: accountContract.client,
  });

  if (isValid) {
    return erc6492Sig;
  }
  throw new Error(
    "Unable to verify signature on smart account, please make sure the admin wallet has permissions and the signature is valid.",
  );
}

export async function deployAndSignTypedData<
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
  // check if the account contract supports EIP721 domain separator based signing
  const is712Factory = await checkFor712Factory({
    factoryContract,
    accountContract,
    originalMsgHash,
  });

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
    sig = await options.personalAccount.signTypedData(typedData);
  }

  const deployTx = prepareCreateAccount({
    factoryContract,
    adminAddress: options.personalAccount.address,
    accountSalt: options.overrides?.accountSalt,
    createAccountOverride: options.overrides?.createAccount,
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

  // check if the signature is valid
  const isValid = await verifyHash({
    hash: originalMsgHash,
    signature: erc6492Sig,
    address: accountContract.address,
    chain: accountContract.chain,
    client: accountContract.client,
  });

  if (isValid) {
    return erc6492Sig;
  }
  throw new Error(
    "Unable to verify signature on smart account, please make sure the admin wallet has permissions and the signature is valid.",
  );
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

async function checkFor712Factory({
  factoryContract,
  accountContract,
  originalMsgHash,
}: {
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  originalMsgHash: Hex;
}) {
  try {
    const implementationAccount = await readContract({
      contract: factoryContract,
      method: "function accountImplementation() public view returns (address)",
    });
    // check if the account contract supports EIP721 domain separator or modular based signing
    const is712Factory = await readContract({
      contract: getContract({
        address: implementationAccount,
        chain: accountContract.chain,
        client: accountContract.client,
      }),
      method:
        "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
      params: [originalMsgHash],
    })
      .then((res) => res !== "0x")
      .catch(() => false);

    return is712Factory;
  } catch {
    return false;
  }
}
