import type { ParseMethod } from "./abi/types.js";
import { createThirdwebClient } from "./client/client.js";
import { getContract, type GetContractOptions } from "./contract/index.js";
import { transaction, type TransactionOptions } from "./transaction/index.js";
import { memoizePromise } from "./utils/promise.js";
import type { AbiFunction } from "abitype";

export type CreateClientOptions =
  | {
      clientId: string;
      secretKey?: never;
    }
  | {
      clientId?: never;
      secretKey: string;
    };

/**
 *
 * @param options - the {@link CreateClientOptions} to create the client with
 * @returns - the client
 *
 * @example
 * ```ts
 * import { createClient } from "@thirdweb-dev/thirdweb";
 *
 * const client = createClient({
 *  clientId: "my-client-id",
 * });
 * ```
 */
export function createClient(options: CreateClientOptions) {
  const thirdwebClient = createThirdwebClient(options);

  return {
    // add on the underlying client
    ...thirdwebClient,

    // contract
    contract: (contractOptions: GetContractOptions) => {
      const contract = getContract(thirdwebClient, contractOptions);

      return {
        ...contract,
        // add on the transaction function
        transaction: <
          const method extends string,
          const abi extends AbiFunction = method extends `function ${string}`
            ? ParseMethod<method>
            : AbiFunction,
        >(
          txOptions: TransactionOptions<method, abi>,
        ) => {
          const tx = transaction(thirdwebClient, {
            ...txOptions,
            ...contractOptions,
          });
          return {
            ...tx,
            encode: memoizePromise(async () => {
              const { encode } = await import(
                "./transaction/actions/encode.js"
              );
              return encode(tx);
            }),
            read: async () => {
              const { read } = await import("./transaction/actions/read.js");
              return read(tx);
            },
          };
        },
        // add on the read function
        read: async <
          const method extends string,
          const abi extends AbiFunction = method extends `function ${string}`
            ? ParseMethod<method>
            : AbiFunction,
        >(
          txOptions: TransactionOptions<method, abi>,
        ) => {
          const tx = transaction(thirdwebClient, {
            ...txOptions,
            ...contractOptions,
          });
          const { read } = await import("./transaction/actions/read.js");
          return read(tx);
        },
      };
    },
  };
}
