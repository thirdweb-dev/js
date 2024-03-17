import { toBigInt } from "../../../utils/bigint.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { Chain } from "../../../chains/types.js";
import { getKeyGateway } from "../contracts.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Address } from "abitype";

/**
 * Represents the parameters for the `addSigner` function.
 * @description
 * This function can be used wither be provided pre-generated signatures or the wallet accounts directly.
 * This is done so the helpers can be used when there's no direct access to the account, but signatures can be generated (e.g. engine)
 *
 * If the `appAccount` is not provided, the `signedKeyRequestMetadata`, `appAccountAddress` and `deadline` must be provided.
 * `deadline` must match the one used to generate the signature.
 */
export type AddSignerParams = Prettify<
  {
    client: ThirdwebClient;
    signerPublicKey: Hex;
    chain?: Chain;
    disableCache?: boolean;
  } & (
    | {
        appAccount: Account;
      }
    | {
        signedKeyRequestMetadata: Hex;
        appAccountAddress: Address;
        deadline: bigint;
      }
  )
>;

/**
 * Adds farcaster signer for the given account.
 * @param options - The options for adding the signer.
 * @returns A prepared transaction object to add the signer to the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { addSigner } from "thirdweb/extensions/farcaster";
 * const tx = await addSigner({
 *  client,
 * 	appAccount,
 *  signerPublicKey
 * });
 * ```
 */
export function addSigner(options: AddSignerParams) {
  return prepareContractCall({
    contract: getKeyGateway({
      client: options.client,
      chain: options.chain,
    }),
    method: [
      "0x22b1a414",
      [
        {
          type: "uint32",
          name: "keyType",
        },
        {
          type: "bytes",
          name: "key",
        },
        {
          type: "uint8",
          name: "metadataType",
        },
        {
          type: "bytes",
          name: "metadata",
        },
      ],
      [],
    ],
    params: async () => {
      const deadline =
        "deadline" in options
          ? options.deadline
          : BigInt(Math.floor(Date.now() / 1000) + 3600); // default signatures last for 1 hour

      const { getFid } = await import("../read/getFid.js");
      const appFid = await getFid({
        client: options.client,
        chain: options.chain,
        address:
          "appAccount" in options
            ? options.appAccount.address
            : options.appAccountAddress,
        disableCache: options.disableCache,
      });

      const { getSignedKeyRequestMetadata } = await import(
        "../eip712signatures.js"
      );

      let signedKeyRequestMetadata;
      if ("appAccount" in options) {
        signedKeyRequestMetadata = await getSignedKeyRequestMetadata({
          account: options.appAccount,
          message: {
            requestFid: toBigInt(appFid),
            key: options.signerPublicKey,
            deadline,
          },
        });
      } else {
        signedKeyRequestMetadata = options.signedKeyRequestMetadata;
      }

      return [1, options.signerPublicKey, 1, signedKeyRequestMetadata] as const;
    },
  });
}
