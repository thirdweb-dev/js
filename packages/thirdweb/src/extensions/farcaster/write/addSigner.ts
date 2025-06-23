import type { Address } from "abitype";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { toBigInt } from "../../../utils/bigint.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { getKeyGateway } from "../contracts/getKeyGateway.js";
import { getFid } from "../read/getFid.js";

/**
 * Represents the parameters for the `addSigner` function.
 *
 * This function can be used wither be provided pre-generated signatures or the wallet accounts directly.
 * This is done so the helpers can be used when there's no direct access to the account, but signatures can be generated (e.g. engine)
 *
 * If the `appAccount` is not provided, the `signedKeyRequestMetadata`, `appAccountAddress` and `deadline` must be provided.
 * `deadline` must match the one used to generate the signature.
 *
 * @extension FARCASTER
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = addSigner({
 *  client,
 * 	appAccount,
 *  signerPublicKey
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addSigner(options: AddSignerParams) {
  return prepareContractCall({
    contract: getKeyGateway({
      chain: options.chain,
      client: options.client,
    }),
    method: [
      "0x22b1a414",
      [
        {
          name: "keyType",
          type: "uint32",
        },
        {
          name: "key",
          type: "bytes",
        },
        {
          name: "metadataType",
          type: "uint8",
        },
        {
          name: "metadata",
          type: "bytes",
        },
      ],
      [],
    ],
    params: async () => {
      const deadline =
        "deadline" in options
          ? options.deadline
          : BigInt(Math.floor(Date.now() / 1000) + 3600); // default signatures last for 1 hour

      const appFid = await getFid({
        address:
          "appAccount" in options
            ? options.appAccount.address
            : options.appAccountAddress,
        chain: options.chain,
        client: options.client,
        disableCache: options.disableCache,
      });

      // Set the signedKeyRequestMetadata if provided, otherwise generate using the app account
      let signedKeyRequestMetadata: Hex;
      if ("signedKeyRequestMetadata" in options) {
        signedKeyRequestMetadata = options.signedKeyRequestMetadata;
      } else if ("appAccount" in options) {
        const { getSignedKeyRequestMetadata } = await import(
          "../eip712Signatures/keyRequestSignature.js"
        );
        signedKeyRequestMetadata = await getSignedKeyRequestMetadata({
          account: options.appAccount,
          message: {
            deadline,
            key: options.signerPublicKey,
            requestFid: toBigInt(appFid),
          },
        });
      } else {
        throw new Error(
          "Invalid options, expected signedKeyRequestMetadata or appAccount to be provided",
        );
      }

      return [1, options.signerPublicKey, 1, signedKeyRequestMetadata] as const;
    },
  });
}
