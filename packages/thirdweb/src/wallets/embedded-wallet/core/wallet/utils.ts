import type { ThirdwebClient } from "../../../../client/client.js";
import type { AuthUserType } from "../authentication/type.js";
import type { StorageType, WalletStorageFormatType } from "../storage/type.js";
import type {
  CreateWalletOverrideType,
  SensitiveWalletDetailType,
  WalletDetailType,
} from "./type.js";

/**
 * @internal
 * @param walletDetail - Information about the wallet
 * @param keyPiece - The piece of the wallet key to get the unique id for
 * @example
 * ```ts
 * const walletDetail = {
 *     walletId: "123",
 *     // ...
 * };
 * const uniqueId = getWalletUniqueId(walletDetail, "pKey");
 * // "123-pKey"
 * console.log(uniqueId);
 * ```
 */
export const getWalletUniqueId = (
  walletDetail: WalletDetailType,
  keyPiece: "pKey" | "shareA" | "shareB" | "shareC",
) => {
  return `${walletDetail.walletId}-${keyPiece}`;
};

/**
 * Fetches the wallet details for an authenticated user
 * @param arg - The options for fetching the user wallet detail
 * @param arg.user - The authenticated user for which we want to get the wallet details of
 * @example
 * ```ts
 * import { getUserWalletDetail } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 * const wallets = await getUserWalletDetail({
 *  user: {
 *    authToken
 *    // ...
 *  }
 * });
 *
 * console.log(wallets);
 * ```
 * @returns A Promise that resolves to the wallet details of the user
 */
export const getUserWalletDetail = async (arg: {
  user: AuthUserType;
}): Promise<WalletDetailType[]> => {
  const { ROUTE_FETCH_USER_WALLETS } = await import("../routes.js");

  const resp = await fetch(ROUTE_FETCH_USER_WALLETS(), {
    headers: {
      Authorization: `Bearer ${arg.user.authToken}`,
    },
  });
  const result = await resp.json();
  return result as WalletDetailType[];
};

/**
 * Creates a new embedded wallet
 * @param arg - The options for creating a new embedded wallet
 * @param arg.client - The thirdweb client
 * @param arg.authUser - The authenticated user for which we want to create the wallet for
 * @param arg.format - The storage format for the wallet
 * @param arg.createWalletOverride - Optional. A function to override the default wallet creation function
 * @example
 * ```ts
 * import { createWallet } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 *
 * const wallet = await createWallet({
 *    client,
 *    authUser,
 *    format: "sharded",
 * });
 * console.log(wallet);
 * ```
 * @returns A Promise that resolves to the wallet details of the user
 */
export const createWallet = async ({
  createWalletOverride,
  client,
  authUser,
  format,
}: {
  createWalletOverride?: CreateWalletOverrideType | undefined;
  client: ThirdwebClient;
  authUser?: AuthUserType | undefined;
  format: WalletStorageFormatType;
}): Promise<SensitiveWalletDetailType> => {
  const { EmbeddedWalletError } = await import("./error.js");
  const { ROUTE_NEW_STORAGE } = await import("../routes.js");

  const secretKey = client.secretKey;
  const walletIdResp = await fetch(ROUTE_NEW_STORAGE(), {
    method: "POST",
    headers: {
      "x-secret-key": secretKey ?? "",
      Authorization: `Bearer ${authUser?.authToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!walletIdResp.ok) {
    throw new EmbeddedWalletError("Failed to create wallet");
  }
  const { uuid: walletId } = await walletIdResp.json();

  if (createWalletOverride) {
    const wallet = await createWalletOverride();
    return {
      walletId,
      address: wallet.address,
      keyMaterial: wallet.privateKey,
      keyGenerationSource: "developer",
      client: client,
      userId: authUser?.userDetails.userId,
      walletState: "loaded",
      createdAt: Date.now(),
      format: format,
    };
  }

  // TODO: Move this to iframe??
  const { generatePrivateKey, privateKeyToAccount } = await import(
    "viem/accounts"
  );
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return {
    walletId,
    address: account.address,
    keyMaterial: privateKey,
    keyGenerationSource: "thirdweb",
    client: client,
    userId: authUser?.userDetails.userId,
    walletState: "loaded",
    createdAt: Date.now(),
    format: format,
  };
};

/**
 * Saves the embedded wallet to the storage
 * @param arg - The options for saving the wallet
 * @param arg.walletDetail - The wallet details to save
 * @param arg.storage - The storage option containing info to save the wallet
 * @example
 * ```ts
 * import { saveWallet } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 *
 * const wallet = await saveWallet({
 *   walletDetail,
 *   storage,
 * });
 * console.log(wallet);
 * ```
 * @returns A Promise that resolves to the wallet detail that was saved
 */
export const saveWallet = async ({
  storage,
  walletDetail,
}: {
  walletDetail: SensitiveWalletDetailType;
  storage: StorageType;
}): Promise<SensitiveWalletDetailType> => {
  const { keyMaterial } = walletDetail;
  const censoredWalletDetail: WalletDetailType = {
    address: walletDetail.address,
    client: walletDetail.client,
    userId: walletDetail.userId,
    walletState: walletDetail.walletState,
    createdAt: walletDetail.createdAt,
    format: walletDetail.format,
    keyGenerationSource: walletDetail.keyGenerationSource,
    walletId: walletDetail.walletId,
  };

  switch (storage.format) {
    case "privateKey": {
      await storage.save({
        keyMaterial,
        authUser: storage.authUser,
        walletDetail: censoredWalletDetail,
        uniqueId: getWalletUniqueId(censoredWalletDetail, "pKey"),
      });
      break;
    }
    case "sharded": {
      const {
        shares: [shareA, shareB, shareC],
      } = await createShares(keyMaterial);
      await Promise.all([
        storage.shareA.save({
          keyMaterial: shareA,
          authUser: storage.authUser,
          uniqueId: getWalletUniqueId(censoredWalletDetail, "shareA"),
          walletDetail: censoredWalletDetail,
        }),
        storage.shareB.save({
          keyMaterial: shareB,
          authUser: storage.authUser,
          uniqueId: getWalletUniqueId(censoredWalletDetail, "shareB"),
          walletDetail: censoredWalletDetail,
        }),
        storage.shareC.save({
          keyMaterial: shareC,
          authUser: storage.authUser,
          uniqueId: getWalletUniqueId(censoredWalletDetail, "shareC"),
          walletDetail: censoredWalletDetail,
        }),
      ]);
      break;
    }
  }
  return { ...walletDetail };
};

/**
 * Loads the embedded wallet from the storage
 * @param arg - The options for loading the wallet
 * @param arg.storage - The storage option containing info to load the wallet
 * @param arg.walletDetail - The wallet details to load
 * @example
 * ```ts
 * import { loadWallet } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 *
 * const wallet = await loadWallet({
 *  storage,
 *  walletDetail,
 * });
 * console.log(wallet);
 * ```
 * @returns A Promise that resolves to the wallet detail that was passed in
 */
export const loadWallet = async ({
  storage,
  walletDetail,
}: {
  storage: StorageType;
  walletDetail: WalletDetailType;
}): Promise<SensitiveWalletDetailType> => {
  const { EmbeddedWalletError } = await import("./error.js");
  if (storage.format !== walletDetail.format) {
    throw new EmbeddedWalletError(
      `Wallet storage format mismatched. Wallet storage format: ${walletDetail.format}, provided storage format: ${storage.format}`,
    );
  }
  const walletId = walletDetail.walletId;
  if (!walletId) {
    throw new EmbeddedWalletError(
      "Cannot load a wallet without a walletId. Try saving the wallet first.",
    );
  }
  switch (storage.format) {
    case "privateKey": {
      const keyMaterial = await storage.load({
        uniqueId: getWalletUniqueId(walletDetail, "pKey"),
        walletDetail,
        authUser: storage.authUser,
      });
      return {
        ...walletDetail,
        walletId,
        keyMaterial,
      };
    }
    case "sharded": {
      const [shareA, shareB, shareC] = await Promise.all([
        storage.shareA.load({
          uniqueId: getWalletUniqueId(walletDetail, "shareA"),
          walletDetail,
          authUser: storage.authUser,
        }),
        storage.shareB.load({
          uniqueId: getWalletUniqueId(walletDetail, "shareB"),
          walletDetail,
          authUser: storage.authUser,
        }),
        storage.shareC.load({
          uniqueId: getWalletUniqueId(walletDetail, "shareC"),
          walletDetail,
          authUser: storage.authUser,
        }),
      ]);
      const keyMaterial = await combineShares([shareA, shareB, shareC]);
      return {
        ...walletDetail,
        walletId,
        keyMaterial,
      };
    }
    default: {
      throw new Error("Bad State: Invalid storage format");
    }
  }
};

const WALLET_PRIVATE_KEY_PREFIX = "thirdweb_";
async function createShares(keyMaterial: string): Promise<{
  shares: [string, string, string];
}> {
  const { share } = await import("secrets.js-34r7h");
  const { utf8ToHex } = await import("../../../../utils/hex.js");
  let stringToShard = "";

  // Salt to prevent share corruption through tampering
  stringToShard = utf8ToHex(`${WALLET_PRIVATE_KEY_PREFIX}${keyMaterial}`);

  const shares = share(stringToShard, 3, 2);
  const shareA = shares[0];
  const shareB = shares[1];
  const shareC = shares[2];
  if (!shareA || !shareB || !shareC) {
    throw new Error("Missing shares");
  }
  return {
    shares: [shareA, shareB, shareC],
  };
}

async function combineShares(shares: string[]) {
  // !we need full import because combine relies on extractShareComponent which gets dropped in import if we import combine directly
  const secrets = await import("secrets.js-34r7h");
  const { hexToUtf8 } = await import("../../../../utils/hex.js");
  const { EmbeddedWalletError } = await import("./error.js");

  const privateKeyHex = secrets.combine(shares);
  const privateKey = hexToUtf8(privateKeyHex);

  if (!privateKey.startsWith(WALLET_PRIVATE_KEY_PREFIX)) {
    throw new EmbeddedWalletError(`Corrupted share encountered`);
  }
  const rawPrivateKey = privateKey.split(WALLET_PRIVATE_KEY_PREFIX)[1];
  if (!rawPrivateKey) {
    throw new Error(`Bad State: no key found`);
  }
  return rawPrivateKey;
}
