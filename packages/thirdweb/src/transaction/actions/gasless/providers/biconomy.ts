import type { Address } from "abitype";
import { encodeAbiParameters } from "viem";
import { ZERO_ADDRESS } from "../../../../constants/addresses.js";
import { getContract } from "../../../../contract/contract.js";
import { getAddress } from "../../../../utils/address.js";
import { isHex } from "../../../../utils/encoding/helpers/is-hex.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";
import { stringify } from "../../../../utils/json.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../../prepare-transaction.js";
import { readContract } from "../../../read-contract.js";
import type { SerializableTransaction } from "../../../serialize-transaction.js";
import type { WaitForReceiptOptions } from "../../wait-for-tx-receipt.js";

/**
 * @transaction
 */
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
  serializableTransaction: SerializableTransaction;
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
    batchId: BATCH_ID,
    batchNonce: nonce,
    data: serializableTransaction.data,
    deadline: deadline,
    from: account.address,
    to: serializableTransaction.to,
    token: ZERO_ADDRESS,
    tokenGasPrice: 0n,
    txGas: serializableTransaction.gas,
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
      getAddress(request.from),
      getAddress(request.to),
      getAddress(request.token),
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
      body: stringify({
        apiId: options.gasless.apiId,
        from: request.from,
        gasLimit: request.txGas,
        params: [request, signature],
        to: request.to,
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-api-key": options.gasless.apiKey,
      },
      method: "POST",
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to send transaction: ${await response.text()}`);
  }
  const json = await response.json();
  const transactionHash = json.txHash;
  if (isHex(transactionHash)) {
    return {
      chain: options.transaction.chain,
      client: options.transaction.client,
      transactionHash: transactionHash,
    };
  }
  throw new Error(`Failed to send transaction: ${stringify(json)}`);
}
