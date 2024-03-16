import type { Address } from "abitype";
import { toBigInt } from "../../../utils/bigint.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { Chain } from "../../../chains/types.js";
import { getBundler } from "../contracts.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";

/**
 * Represents the parameters for the `registerFidAndSigner` function.
 */
export type RegisterFidAndSignerParams = Prettify<
  {
    client: ThirdwebClient;
    recoveryAddress: Address;
    signerPublicKey: Hex;
    chain?: Chain;
    extraStorage?: bigint | number;
    disableCache?: boolean;
  } & (
    | {
        userAccount: Account;
      }
    | {
        registerSignature: Hex;
        addSignature: Hex;
        userAddress: Address;
        deadline: bigint;
      }
  ) &
    (
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
 * Registers a Farcaster fid and signer for the given wallet using the provided app account.
 * @param options - The options for registering an account.
 * @returns A prepared transaction object to register the account.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { registerFidAndSigner } from "thirdweb/extensions/farcaster";
 * const tx = await registerFidAndSigner({
 *  client,
 *  userAccount,
 *  appAccount,
 * 	recoveryAddress,
 *  signerPublicKey
 * });
 * ```
 */
export function registerFidAndSigner(options: RegisterFidAndSignerParams) {
  const extraStorage = toBigInt(options.extraStorage ?? 0);
  if (extraStorage < 0n)
    throw new Error(
      `Expected extraStorage to be greater than or equal to 0, got ${options.extraStorage}`,
    );

  return prepareContractCall({
    contract: getBundler({
      client: options.client,
      chain: options.chain,
    }),
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
      const deadline =
        "deadline" in options
          ? options.deadline
          : BigInt(Math.floor(Date.now() / 1000) + 3600); // default signatures last for 1 hour

      const { getFid } = await import("../read/getFid.js");
      const existingFid = await getFid({
        client: options.client,
        chain: options.chain,
        address:
          "userAccount" in options
            ? options.userAccount.address
            : options.userAddress,
        disableCache: options.disableCache,
      });
      if (existingFid !== 0n)
        throw new Error(
          `User already has an fid registered, found fid ${existingFid}`,
        );

      const { getKeyGateway } = await import("../contracts.js");
      const keyGateway = getKeyGateway({
        client: options.client,
        chain: options.chain,
      });

      const { nonces } = await import(
        "../__generated__/IKeyGateway/read/nonces.js"
      );
      const nonce = await nonces({
        account:
          "userAccount" in options
            ? options.userAccount.address
            : options.userAddress,
        contract: keyGateway,
      });

      const { signRegister, signAdd, getSignedKeyRequestMetadata } =
        await import("../eip712signatures.js");

      let registerSignature;
      if ("userAccount" in options) {
        registerSignature = await signRegister({
          account: options.userAccount,
          message: {
            nonce,
            to: options.userAccount.address,
            recovery: options.recoveryAddress,
            deadline,
          },
        });
      } else registerSignature = options.registerSignature;

      const appFid = await getFid({
        client: options.client,
        chain: options.chain,
        address:
          "appAccount" in options
            ? options.appAccount.address
            : options.appAccountAddress,
        disableCache: options.disableCache,
      });

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
      } else signedKeyRequestMetadata = options.signedKeyRequestMetadata;

      let addSignature;
      if ("userAccount" in options) {
        addSignature = await signAdd({
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
      } else {
        addSignature = options.addSignature;
      }

      return [
        {
          to:
            "userAccount" in options
              ? options.userAccount.address
              : options.userAddress,
          recovery: options.recoveryAddress,
          deadline,
          sig: registerSignature,
        },
        [
          {
            keyType: 1,
            key: options.signerPublicKey,
            metadataType: 1,
            metadata: signedKeyRequestMetadata,
            deadline,
            sig: addSignature,
          },
        ],
        extraStorage,
      ] as const;
    },
  });
}
