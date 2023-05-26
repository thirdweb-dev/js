import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  CONTRACT_ADDRESSES,
  getContractAddressByChainId,
} from "../constants/addresses";
import { DeployTransaction, Transaction } from "../core/classes/transactions";
import {
  ForwardRequestMessage,
  GaslessTransaction,
  PermitRequestMessage,
  TransactionResult,
} from "../core/types";
import { SDKOptionsOutput } from "../schema/sdk-options";
import { computeEOAForwarderAddress } from "./any-evm-utils/computeEOAForwarderAddress";
import { computeForwarderAddress } from "./any-evm-utils/computeForwarderAddress";
import {
  BiconomyForwarderAbi,
  ChainAwareForwardRequest,
  ForwardRequest,
  getAndIncrementNonce,
} from "./forwarder";
import { signEIP2612Permit } from "./permit";
import { signTypedDataInternal } from "./sign";
import ForwarderABI from "@thirdweb-dev/contracts-js/dist/abis/Forwarder.json";
import fetch from "cross-fetch";
import { BigNumber, BytesLike, ethers } from "ethers";
import invariant from "tiny-invariant";

export function buildDeployTransactionFunction<TArgs extends any[]>(
  fn: (...args: TArgs) => Promise<DeployTransaction>,
) {
  async function executeFn(...args: TArgs): Promise<string> {
    const tx = await fn(...args);
    return tx.execute();
  }

  executeFn.prepare = fn;
  return executeFn;
}

export function buildTransactionFunction<
  TArgs extends any[],
  TResult = TransactionResult,
>(fn: (...args: TArgs) => Promise<Transaction<TResult>>) {
  async function executeFn(...args: TArgs): Promise<TResult> {
    const tx = await fn(...args);
    return tx.execute();
  }

  executeFn.prepare = fn;
  return executeFn;
}

export async function defaultGaslessSendFunction(
  transaction: GaslessTransaction,
  signer: ethers.Signer,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  if (gaslessOptions && "biconomy" in gaslessOptions) {
    return biconomySendFunction(transaction, signer, provider, gaslessOptions);
  }
  return defenderSendFunction(
    transaction,
    signer,
    provider,
    storage,
    gaslessOptions,
  );
}

export async function prepareGaslessRequest(tx: Transaction) {
  // @ts-expect-error
  const gaslessTx = await tx.prepareGasless();
  const gaslessOptions = tx.getGaslessOptions();

  if (gaslessOptions && "biconomy" in gaslessOptions) {
    const request = await biconomyPrepareRequest(
      gaslessTx,
      // @ts-expect-error
      tx.signer,
      // @ts-expect-error
      tx.provider,
      gaslessOptions,
    );

    return {
      url: "https://api.biconomy.io/api/v2/meta-tx/native",
      ...request,
    };
  } else {
    invariant(
      gaslessOptions && "openzeppelin" in gaslessOptions,
      "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
    );

    const request = await defenderPrepareRequest(
      gaslessTx,
      // @ts-expect-error
      tx.signer,
      // @ts-expect-error
      tx.provider,
      // @ts-expect-error
      tx.storage,
      gaslessOptions,
    );

    return {
      url: gaslessOptions.openzeppelin.relayerUrl,
      ...request,
    };
  }
}

async function biconomyPrepareRequest(
  transaction: GaslessTransaction,
  signer: ethers.Signer,
  provider: ethers.providers.Provider,
  gaslessOptions?: SDKOptionsOutput["gasless"],
) {
  invariant(
    gaslessOptions && "biconomy" in gaslessOptions,
    "calling biconomySendFunction without biconomy",
  );
  invariant(signer && provider, "signer and provider must be set");

  const forwarder = new ethers.Contract(
    getContractAddressByChainId(
      transaction.chainId,
      "biconomyForwarder",
    ) as string,
    BiconomyForwarderAbi,
    provider,
  );
  const batchId = 0;
  const batchNonce = await getAndIncrementNonce(forwarder, "getNonce", [
    transaction.from,
    batchId,
  ]);

  const request = {
    from: transaction.from,
    to: transaction.to,
    token: ethers.constants.AddressZero,
    txGas: transaction.gasLimit.toNumber(),
    tokenGasPrice: "0",
    batchId,
    batchNonce: batchNonce.toNumber(),
    deadline: Math.floor(
      Date.now() / 1000 +
        ((gaslessOptions &&
          "biconomy" in gaslessOptions &&
          gaslessOptions.biconomy?.deadlineSeconds) ||
          3600),
    ),
    data: transaction.data,
  };

  const hashToSign = ethers.utils.arrayify(
    ethers.utils.solidityKeccak256(
      [
        "address",
        "address",
        "address",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "bytes32",
      ],
      [
        request.from,
        request.to,
        request.token,
        request.txGas,
        request.tokenGasPrice,
        request.batchId,
        request.batchNonce,
        request.deadline,
        ethers.utils.keccak256(request.data),
      ],
    ),
  );

  const signature = await signer.signMessage(hashToSign);

  return {
    method: "POST",
    body: JSON.stringify({
      from: transaction.from,
      apiId: gaslessOptions.biconomy.apiId,
      params: [request, signature],
      to: transaction.to,
      gasLimit: transaction.gasLimit.toHexString(),
    }),
    headers: {
      "x-api-key": gaslessOptions.biconomy.apiKey,
      "Content-Type": "application/json;charset=utf-8",
    },
  };
}

export async function biconomySendFunction(
  transaction: GaslessTransaction,
  signer: ethers.Signer,
  provider: ethers.providers.Provider,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  const request = await biconomyPrepareRequest(
    transaction,
    signer,
    provider,
    gaslessOptions,
  );
  const response = await fetch(
    "https://api.biconomy.io/api/v2/meta-tx/native",
    request,
  );

  if (response.ok) {
    const resp = await response.json();
    if (!resp.txHash) {
      throw new Error(`relay transaction failed: ${resp.log}`);
    }
    return resp.txHash;
  }
  throw new Error(
    `relay transaction failed with status: ${response.status} (${response.statusText})`,
  );
}

async function defenderPrepareRequest(
  transaction: GaslessTransaction,
  signer: ethers.Signer,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
) {
  invariant(
    gaslessOptions && "openzeppelin" in gaslessOptions,
    "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
  );
  invariant(signer, "provider is not set");
  invariant(provider, "provider is not set");
  const forwarderAddress =
    gaslessOptions.openzeppelin.relayerForwarderAddress ||
    (gaslessOptions.openzeppelin.useEOAForwarder
      ? CONTRACT_ADDRESSES[
          transaction.chainId as keyof typeof CONTRACT_ADDRESSES
        ].openzeppelinForwarderEOA ||
        (await computeEOAForwarderAddress(provider, storage))
      : CONTRACT_ADDRESSES[
          transaction.chainId as keyof typeof CONTRACT_ADDRESSES
        ].openzeppelinForwarder ||
        (await computeForwarderAddress(provider, storage)));

  const forwarder = new ethers.Contract(
    forwarderAddress,
    ForwarderABI,
    provider,
  );
  const nonce = await getAndIncrementNonce(forwarder, "getNonce", [
    transaction.from,
  ]);
  let domain;
  let types;
  let message: ForwardRequestMessage | PermitRequestMessage;
  if (gaslessOptions.experimentalChainlessSupport) {
    domain = {
      name: "GSNv2 Forwarder",
      version: "0.0.1",
      verifyingContract: forwarderAddress,
    };
    types = {
      ForwardRequest: ChainAwareForwardRequest,
    };
    message = {
      from: transaction.from,
      to: transaction.to,
      value: BigNumber.from(0).toString(),
      gas: BigNumber.from(transaction.gasLimit).toString(),
      nonce: BigNumber.from(nonce).toString(),
      data: transaction.data,
      chainid: BigNumber.from(transaction.chainId).toString(),
    };
  } else {
    domain = {
      name: gaslessOptions.openzeppelin.domainName,
      version: gaslessOptions.openzeppelin.domainVersion,
      chainId: transaction.chainId,
      verifyingContract: forwarderAddress,
    };
    types = {
      ForwardRequest,
    };
    message = {
      from: transaction.from,
      to: transaction.to,
      value: BigNumber.from(0).toString(),
      gas: BigNumber.from(transaction.gasLimit).toString(),
      nonce: BigNumber.from(nonce).toString(),
      data: transaction.data,
    };
  }

  let signature: BytesLike;

  // if the executing function is "approve" and matches with erc20 approve signature
  // and if the token supports permit, then we use permit for gasless instead of approve.
  if (
    transaction.functionName === "approve" &&
    transaction.functionArgs.length === 2
  ) {
    const spender = transaction.functionArgs[0];
    const amount = transaction.functionArgs[1];
    // TODO: support DAI permit by signDAIPermit
    const { message: permit, signature: sig } = await signEIP2612Permit(
      signer,
      transaction.to,
      transaction.from,
      spender,
      amount,
    );

    const { r, s, v } = ethers.utils.splitSignature(sig);

    message = {
      to: transaction.to,
      owner: permit.owner,
      spender: permit.spender,
      value: BigNumber.from(permit.value).toString(),
      nonce: BigNumber.from(permit.nonce).toString(),
      deadline: BigNumber.from(permit.deadline).toString(),
      r,
      s,
      v,
    };
    signature = sig;
  } else {
    const { signature: sig } = await signTypedDataInternal(
      signer,
      domain,
      types,
      message,
    );
    signature = sig;
  }

  let messageType = "forward";

  // if has owner property then it's permit :)
  if ((message as PermitRequestMessage)?.owner) {
    messageType = "permit";
  }

  return {
    method: "POST",
    body: JSON.stringify({
      request: message,
      signature,
      forwarderAddress,
      type: messageType,
    }),
  };
}

export async function defenderSendFunction(
  transaction: GaslessTransaction,
  signer: ethers.Signer,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  gaslessOptions?: SDKOptionsOutput["gasless"],
): Promise<string> {
  invariant(
    gaslessOptions && "openzeppelin" in gaslessOptions,
    "calling openzeppelin gasless transaction without openzeppelin config in the SDK options",
  );

  const request = await defenderPrepareRequest(
    transaction,
    signer,
    provider,
    storage,
    gaslessOptions,
  );

  const response = await fetch(gaslessOptions.openzeppelin.relayerUrl, request);
  if (response.ok) {
    const resp = await response.json();
    if (!resp.result) {
      throw new Error(`Relay transaction failed: ${resp.message}`);
    }
    const result = JSON.parse(resp.result);
    return result.txHash;
  }
  throw new Error(
    `relay transaction failed with status: ${response.status} (${response.statusText})`,
  );
}
