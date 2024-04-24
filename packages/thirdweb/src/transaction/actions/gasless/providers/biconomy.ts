import type { Address } from "abitype";
import { type TransactionSerializable, encodeAbiParameters } from "viem";
import { ADDRESS_ZERO } from "../../../../constants/addresses.js";
import { getContract } from "../../../../contract/contract.js";
import { isHex } from "../../../../utils/encoding/helpers/is-hex.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";
import { stringify } from "../../../../utils/json.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../../prepare-transaction.js";
import { readContract } from "../../../read-contract.js";
import type { WaitForReceiptOptions } from "../../wait-for-tx-receipt.js";

export type BiconomyOptions = {
  provider: "biconomy";
  // you can find the correct forwarder for your network here: https://docs-gasless.biconomy.io/misc/contract-addresses
  relayerForwarderAddress: Address;
  apiId: string;
  apiKey: string;
  deadlineSeconds?: number; // default: 3600
};

type SendBiconomyTransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
  serializableTransaction: TransactionSerializable;
  gasless: BiconomyOptions;
};

// we do not send multiple batches so this stays consistent
const BATCH_ID = 0n;

/**
 * @internal - only exported for testing
 */
export async function prepareBiconomyTransaction({
  account,
  serializableTransaction,
  transaction,
  gasless,
}: SendBiconomyTransactionOptions) {
  const forwarderContract = getContract({
    address: gasless.relayerForwarderAddress,
    chain: transaction.chain,
    client: transaction.client,
  });

  // get the nonce
  const nonce = await readContract({
    contract: forwarderContract,
    method: "function getNonce(address,uint256) view returns (uint256)",
    params: [account.address, BATCH_ID],
  });

  const deadline =
    Math.floor(Date.now() / 1000) + (gasless.deadlineSeconds ?? 3600);

  const request = {
    from: account.address,
    to: serializableTransaction.to,
    token: ADDRESS_ZERO,
    txGas: serializableTransaction.gas,
    tokenGasPrice: 0n,
    batchId: BATCH_ID,
    batchNonce: nonce,
    deadline: deadline,
    data: serializableTransaction.data,
  };

  if (!request.to) {
    throw new Error("Cannot send a transaction without a `to` address");
  }
  if (!request.txGas) {
    throw new Error("Cannot send a transaction without a `gas` value");
  }
  if (!request.data) {
    throw new Error("Cannot send a transaction without a `data` value");
  }

  // create the hash
  const message = encodeAbiParameters(
    [
      { type: "address" },
      { type: "address" },
      { type: "address" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "bytes32" },
    ],
    [
      request.from,
      request.to,
      request.token,
      request.txGas,
      request.tokenGasPrice,
      request.batchId,
      request.batchNonce,
      keccak256(request.data),
    ],
  );

  const signature = await account.signMessage({ message });

  return [request, signature] as const;
}

/**
 * @internal
 */
export async function relayBiconomyTransaction(
  options: SendBiconomyTransactionOptions,
): Promise<WaitForReceiptOptions> {
  const [request, signature] = await prepareBiconomyTransaction(options);

  // send the transaction to the biconomy api
  const response = await fetch(
    "https://api.biconomy.io/api/v2/meta-tx/native",
    {
      method: "POST",
      body: stringify({
        apiId: options.gasless.apiId,
        params: [request, signature],
        from: request.from,
        to: request.to,
        gasLimit: request.txGas,
      }),
      headers: {
        "x-api-key": options.gasless.apiKey,
        "Content-Type": "application/json;charset=utf-8",
      },
    },
  );
  if (!response.ok) {
    response.body?.cancel();
    throw new Error(`Failed to send transaction: ${await response.text()}`);
  }
  const json = await response.json();
  const transactionHash = json.txHash;
  if (isHex(transactionHash)) {
    return {
      transactionHash: transactionHash,
      chain: options.transaction.chain,
      client: options.transaction.client,
    };
  }
  throw new Error(`Failed to send transaction: ${stringify(json)}`);
}
