import type { KMSClientConfig } from "@aws-sdk/client-kms";
import { KmsSigner } from "aws-kms-signer";
import type {
  SignableMessage,
  TransactionSerializable,
  TypedData,
  TypedDataDefinition,
} from "viem";
import { hashTypedData, toBytes } from "viem";
import { getCachedChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { eth_sendRawTransaction } from "../rpc/actions/eth_sendRawTransaction.js";
import { getRpcClient } from "../rpc/rpc.js";
import { serializeTransaction } from "../transaction/serialize-transaction.js";
import type { Address } from "../utils/address.js";
import type { Hex } from "../utils/encoding/hex.js";
import { keccak256 } from "../utils/hashing/keccak256.js";
import type { Account } from "./interfaces/wallet.js";

const Buffer = globalThis.Buffer;

type SendTransactionResult = {
  transactionHash: Hex;
};

type SendTransactionOption = TransactionSerializable & {
  chainId: number;
};

type AwsKmsAccountOptions = {
  keyId: string;
  config?: KMSClientConfig;
  client: ThirdwebClient;
};

export async function getAwsKmsAccount(
  options: AwsKmsAccountOptions,
): Promise<Account> {
  if (typeof Buffer === "undefined") {
    throw new Error("AwsKmsAccount only works in Node.js environment");
  }

  const { keyId, config, client } = options;
  const signer = new KmsSigner(keyId, config);

  // Populate address immediately
  const addressUnprefixed = await signer.getAddress();
  const address = `0x${addressUnprefixed}` as Address;

  async function signTransaction(tx: TransactionSerializable): Promise<Hex> {
    const serializedTx = serializeTransaction({ transaction: tx });
    const txHash = keccak256(serializedTx);

    // we don't polyfill buffer, but signer.sign explicitly requires a buffer
    // what do we do here?
    const signature = await signer.sign(Buffer.from(txHash.slice(2), "hex"));

    const r = `0x${signature.r.toString("hex")}` as Hex;
    const s = `0x${signature.s.toString("hex")}` as Hex;
    const v = signature.v;

    const yParity = v % 2 === 0 ? 1 : (0 as 0 | 1);

    const signedTx = serializeTransaction({
      transaction: tx,
      signature: {
        r,
        s,
        yParity,
      },
    });

    return signedTx;
  }

  async function signMessage({
    message,
  }: {
    message: SignableMessage;
  }): Promise<Hex> {
    let messageHash: Hex;
    if (typeof message === "string") {
      const prefixedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
      messageHash = keccak256(toBytes(prefixedMessage));
    } else if ("raw" in message) {
      messageHash = keccak256(message.raw);
    } else {
      throw new Error("Invalid message format");
    }

    const signature = await signer.sign(
      Buffer.from(messageHash.slice(2), "hex"),
    );
    return `0x${signature.toString()}`;
  }

  async function signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(_typedData: TypedDataDefinition<typedData, primaryType>): Promise<Hex> {
    const typedDataHash = hashTypedData(_typedData);
    const signature = await signer.sign(
      Buffer.from(typedDataHash.slice(2), "hex"),
    );
    return `0x${signature.toString()}`;
  }

  async function sendTransaction(
    tx: SendTransactionOption,
  ): Promise<SendTransactionResult> {
    const rpcRequest = getRpcClient({
      client: client,
      chain: getCachedChain(tx.chainId),
    });

    const signedTx = await signTransaction(tx);

    const transactionHash = await eth_sendRawTransaction(rpcRequest, signedTx);
    return { transactionHash };
  }

  return {
    address,
    sendTransaction,
    signMessage,
    signTypedData,
    signTransaction,
  } satisfies Account;
}
