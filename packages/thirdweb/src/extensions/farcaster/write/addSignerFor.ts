import { toBigInt } from "../../../utils/bigint.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { Chain } from "../../../chains/types.js";
import { getKeyGateway } from "../contracts.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { signAdd } from "../eip712signatures.js";

/**
 * Represents the parameters for the `addSignerFor` function.
 */
export type AddSignerForParams = {
  client: ThirdwebClient;
  appAccount: Account;
  userAccount: Account;
  signerPublicKey: Hex;
  chain?: Chain;
  disableCache?: boolean;
};

/**
 * Adds farcaster signer for a given user. Helpful if you want to cover the gas fee for a user.
 * @param options - The options for adding the signer.
 * @returns A prepared transaction object to add the signer to the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { addSignerFor } from "thirdweb/extensions/farcaster";
 * const tx = await addSignerFor({
 *  client,
 * 	appAccount,
 * 	userAccount,
 *  signerPublicKey
 * });
 * ```
 */
export function addSignerFor(options: AddSignerForParams) {
  const keyGateway = getKeyGateway({
    client: options.client,
    chain: options.chain,
  });
  return prepareContractCall({
    contract: keyGateway,
    method: [
      "0xa005d3d2",
      [
        {
          type: "address",
          name: "fidOwner",
        },
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
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "bytes",
          name: "sig",
        },
      ],
      [],
    ],
    params: async () => {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // signatures last for 1 hour

      const { getFid } = await import("../read/getFid.js");
      const appFid = await getFid({
        client: options.client,
        chain: options.chain,
        address: options.appAccount.address,
        disableCache: options.disableCache,
      });

      const { getSignedKeyRequestMetadata } = await import(
        "../eip712signatures.js"
      );

      const signedKeyRequestMetadata = await getSignedKeyRequestMetadata({
        account: options.appAccount,
        message: {
          requestFid: toBigInt(appFid),
          key: options.signerPublicKey,
          deadline,
        },
      });

      const { nonces } = await import(
        "../__generated__/IKeyGateway/read/nonces.js"
      );
      const nonce = await nonces({
        account: options.userAccount.address,
        contract: keyGateway,
      });

      const addSignature = await signAdd({
        account: options.userAccount,
        message: {
          owner: options.userAccount.address,
          keyType: 1,
          key: options.signerPublicKey,
          metadataType: 1,
          metadata: signedKeyRequestMetadata,
          nonce,
          deadline,
        },
      });

      return [
        options.userAccount.address,
        1,
        options.signerPublicKey,
        1,
        signedKeyRequestMetadata,
        deadline,
        addSignature,
      ] as const;
    },
  });
}
