import type { Address } from "abitype";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { toBigInt } from "../../../utils/bigint.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { getBundler } from "../contracts/getBundler.js";
import { getKeyGateway } from "../contracts/getKeyGateway.js";
import { getFid } from "../read/getFid.js";

/**
 * Represents the parameters for the `registerFidAndSigner` function.
 *
 * This function can be used wither be provided pre-generated signatures or the wallet accounts directly.
 * This is done so the helpers can be used when there's no direct access to the account, but signatures can be generated (e.g. engine)
 *
 * If the `userAccount` is not provided, the `registerSignature`, `addSignature`, `userAddress`, and `deadline` must be provided.
 * If the `appAccount` is not provided, the `signedKeyRequestMetadata`, `appAccountAddress`, and `deadline` must be provided.
 * `deadline` must match the one used to generate the signatures.
 *
 * @extension FARCASTER
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = registerFidAndSigner({
 *  client,
 *  userAccount,
 *  appAccount,
 * 	recoveryAddress,
 *  signerPublicKey
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function registerFidAndSigner(options: RegisterFidAndSignerParams) {
  const extraStorage = toBigInt(options.extraStorage ?? 0);
  if (extraStorage < 0n) {
    throw new Error(
      `Expected extraStorage to be greater than or equal to 0, got ${options.extraStorage}`,
    );
  }

  return prepareContractCall({
    contract: getBundler({
      chain: options.chain,
      client: options.client,
    }),
    method: [
      "0xa44c9ce7",
      [
        {
          components: [
            {
              name: "to",
              type: "address",
            },
            {
              name: "recovery",
              type: "address",
            },
            {
              name: "deadline",
              type: "uint256",
            },
            {
              name: "sig",
              type: "bytes",
            },
          ],
          name: "registerParams",
          type: "tuple",
        },
        {
          components: [
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
            {
              name: "deadline",
              type: "uint256",
            },
            {
              name: "sig",
              type: "bytes",
            },
          ],
          name: "signerParams",
          type: "tuple[]",
        },
        {
          name: "extraStorage",
          type: "uint256",
        },
      ],
      [
        {
          name: "fid",
          type: "uint256",
        },
      ],
    ],
    params: async () => {
      const deadline =
        "deadline" in options
          ? options.deadline
          : BigInt(Math.floor(Date.now() / 1000) + 3600); // default deadline is 1 hour from now

      const appAccountAddress =
        "appAccount" in options
          ? options.appAccount.address
          : options.appAccountAddress;
      const userAddress =
        "userAccount" in options
          ? options.userAccount.address
          : options.userAddress;

      // Check if the user already has a registered fid
      const existingFid = await getFid({
        address: userAddress,
        chain: options.chain,
        client: options.client,
        disableCache: options.disableCache,
      });
      // If a fid is already registered for the user, throw an error
      if (existingFid !== 0n) {
        throw new Error(
          `User already has an fid registered, found fid ${existingFid}`,
        );
      }

      const keyGateway = getKeyGateway({
        chain: options.chain,
        client: options.client,
      });

      // Fetch the user's current key gateway nonce
      const { nonces } = await import(
        "../__generated__/IKeyGateway/read/nonces.js"
      );
      const nonce = await nonces({
        account: userAddress,
        contract: keyGateway,
      });

      // Set the registerSignature if provided, otherwise sign the register operation using the userAccount
      let registerSignature: Hex;
      if ("registerSignature" in options) {
        registerSignature = options.registerSignature;
      } else if ("userAccount" in options) {
        const { signRegister } = await import(
          "../eip712Signatures/registerSignature.js"
        );
        registerSignature = await signRegister({
          account: options.userAccount,
          message: {
            deadline,
            nonce,
            recovery: options.recoveryAddress,
            to: userAddress,
          },
        });
      } else {
        throw new Error(
          "Invalid options, expected a userAccount or registerSignature to be provided",
        );
      }

      // Get the fid for the app account
      const appFid = await getFid({
        address: appAccountAddress,
        chain: options.chain,
        client: options.client,
        disableCache: options.disableCache,
      });
      if (appFid === 0n) {
        throw new Error(`No fid found for app account: ${appAccountAddress}`);
      }

      // Set the signedKeyRequestMetadata if provided, otherwise use the app account to generate one
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
          "Invalid options, expected an appAccount or signedKeyRequestMetadata to be provided",
        );
      }

      // Set the addSignature if provided, otherwise sign the add operation using the userAccount
      let addSignature: Hex;
      if ("addSignature" in options) {
        addSignature = options.addSignature;
      } else if ("userAccount" in options) {
        const { signAdd } = await import("../eip712Signatures/addSignature.js");
        addSignature = await signAdd({
          account: options.userAccount,
          message: {
            deadline,
            key: options.signerPublicKey,
            keyType: 1,
            metadata: signedKeyRequestMetadata,
            metadataType: 1,
            nonce,
            owner: userAddress,
          },
        });
      } else {
        throw new Error(
          "Invalid options, expected an addSignature or a userAccount to be provided",
        );
      }

      return [
        {
          deadline,
          recovery: options.recoveryAddress,
          sig: registerSignature,
          to: userAddress,
        },
        [
          {
            deadline,
            key: options.signerPublicKey,
            keyType: 1,
            metadata: signedKeyRequestMetadata,
            metadataType: 1,
            sig: addSignature,
          },
        ],
        extraStorage,
      ] as const;
    },
    value: async () => {
      const { getRegistrationPrice } = await import(
        "../read/getRegistrationPrice.js"
      );
      return await getRegistrationPrice({
        chain: options.chain,
        client: options.client,
        disableCache: options.disableCache,
        extraStorage: extraStorage,
      });
    },
  });
}
