import type { Address } from "abitype";
import { toBigInt } from "../../../utils/bigint.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { Ed25519Keypair } from "../signers.js";
import type { Chain } from "../../../chains/types.js";

/**
 * Represents the parameters for the `registerAppAccount` function.
 */
export type RegisterAppAccountParams = {
  client: ThirdwebClient;
  userAccount: Account;
  appFid: number;
  recoveryAddress: Address;
  signer: Ed25519Keypair;
  chain?: Chain;
  extraStorage?: bigint | number;
  disableCache?: boolean;
};

/**
 * Registers a Farcaster fid for the given wallet using the provided app account.
 * @param options - The options for registering an account.
 * @returns A prepared transaction object to register the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { registerAccount } from "thirdweb/extensions/farcaster";
 * const tx = await registerAccount({
 *  client,
 * 	recoveryAddress
 * });
 * ```
 */
export function registerAppAccount(
  options: BaseTransactionOptions<RegisterAppAccountParams>,
) {
  const extraStorage = toBigInt(options.extraStorage ?? 0);
  if (extraStorage < 0n)
    throw new Error(
      `Expected extraStorage to be greater than or equal to 0, got ${options.extraStorage}`,
    );

  return prepareContractCall({
    ...options,
    method: [
      "0xa44c9ce7",
      [
        {
          type: "tuple",
          name: "registerParams",
          components: [
            {
              type: "address",
              name: "to",
            },
            {
              type: "address",
              name: "recovery",
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
        },
        {
          type: "tuple[]",
          name: "signerParams",
          components: [
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
        },
        {
          type: "uint256",
          name: "extraStorage",
        },
      ],
      [
        {
          type: "uint256",
          name: "fid",
        },
      ],
    ],
    value: async () => {
      const { getRegistrationPrice } = await import(
        "../read/getRegistrationPrice.js"
      );
      return await getRegistrationPrice({
        client: options.client,
        chain: options.chain,
        extraStorage: extraStorage,
        disableCache: options.disableCache,
      });
    },
    params: async () => {
      const { getKeyGateway } = await import("../contracts.js");
      const keyGateway = getKeyGateway({
        client: options.client,
        chain: options.chain,
      });

      const { nonces } = await import(
        "../__generated__/IKeyGateway/read/nonces.js"
      );
      let nonce = await nonces({
        account: options.userAccount.address,
        contract: keyGateway,
      });

      const { signRegister, signAdd, getSignedKeyRequestMetadata } =
        await import("../eip712signatures.js");
      const registerSignature = await signRegister({
        account: options.userAccount,
        message: {
          nonce,
          to: options.userAccount.address,
          recovery: options.recoveryAddress,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // signature lasts for 1 hour
        },
      });

      const signedKeyRequestMetadata = await getSignedKeyRequestMetadata({
        account: options.userAccount,
        message: {
          requestFid: BigInt(options.appFid),
          key: options.signer.publicKey,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // signature lasts for 1 hour
        },
      });

      nonce = await nonces({
        account: options.userAccount.address,
        contract: keyGateway,
      });
      const addSignature = await signAdd({
        account: options.userAccount,
        message: {
          owner: options.userAccount.address,
          keyType: 1,
          key: options.signer.publicKey,
          metadataType: 1,
          metadata: signedKeyRequestMetadata,
          nonce,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // signature lasts for 1 hour
        },
      });

      return [
        {
          to: options.userAccount.address,
          recovery: options.recoveryAddress,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
          sig: registerSignature,
        },
        [
          {
            keyType: 1,
            key: options.signer.publicKey,
            metadataType: 1,
            metadata: signedKeyRequestMetadata,
            deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
            sig: addSignature,
          },
        ],
        extraStorage,
      ] as const;
    },
  });
}
