import type { MethodType } from "./abi/resolveAbiFunction.js";
import { createThirdwebClient } from "./client/client.js";
import { getContract, type GetContractOptions } from "./contract/index.js";
import { createTx, type TransactionOptions } from "./transaction/index.js";
import { memoizePromise } from "./utils/promise.js";

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
    getContract: (contractOptions: GetContractOptions) => {
      const contract = getContract(thirdwebClient, contractOptions);

      return {
        ...contract,
        // add on the transaction function
        createTx: <const method extends MethodType>(
          transactionOptions: TransactionOptions<typeof contract, method>,
        ) => {
          const tx = createTx(contract, transactionOptions);
          return {
            ...tx,
            encode: memoizePromise(async () => {
              const { encode } = await import(
                "./transaction/actions/encode.js"
              );
              // @ts-expect-error - TODO: fix this
              return encode(tx);
            }),
          };
        },
        // add on the read function
        // read: <const method extends MethodType>(
        //   readOptions: TransactionOptions<typeof contract, method>,
        // ) => readContract(contract, readOptions),
      };
    },
    createTx: <const method extends MethodType>(
      transactionOptions: TransactionOptions<typeof thirdwebClient, method>,
    ) => {
      const tx = createTx(thirdwebClient, transactionOptions);
      return {
        ...tx,
        encode: memoizePromise(async () => {
          const { encode } = await import("./transaction/actions/encode.js");
          // @ts-expect-error - TODO: fix this
          return encode(tx);
        }),
      };
    },
    // readContract: <const method extends MethodType>(
    //   readOptions: TransactionOptions<typeof thirdwebClient, method>,
    // ) => readContract(thirdwebClient, readOptions),
  };
}
