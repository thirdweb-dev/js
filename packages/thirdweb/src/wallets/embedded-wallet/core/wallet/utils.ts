import type { ThirdwebClient } from "../../../../client/client.js";
import type { AuthUserType } from "../authentication/type.js";
import type { StorageType, WalletStorageFormatType } from "../storage/type.js";
import type {
  AccountDetailType,
  CreateAccountOverrideType,
  SensitiveAccountDetailType,
} from "./type.js";

/**
 * @internal
 * @param accountDetail - Information about the wallet
 * @param keyPiece - The piece of the wallet key to get the unique id for
 * @example
 * ```ts
 * const accountDetail = {
 *     walletId: "123",
 *     // ...
 * };
 * const uniqueId = getWalletUniqueId(accountDetail, "pKey");
 * // "123-pKey"
 * console.log(uniqueId);
 * ```
 */
export const getWalletUniqueId = (
  accountDetail: AccountDetailType,
  keyPiece: "pKey" | "shareA" | "shareB" | "shareC",
) => {
  return `${accountDetail.accountId}-${keyPiece}`;
};

/**
 * Fetches the wallet details for an authenticated user
 * @param arg - The options for fetching the user wallet detail
 * @param arg.user - The authenticated user for which we want to get the wallet details of
 * @example
 * ```ts
 * import { getUserAccountDetail } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 * const accounts = await getUserAccountDetail({
 *  user: {
 *    authToken
 *    // ...
 *  }
 * });
 *
 * console.log(accounts);
 * ```
 * @returns A Promise that resolves to the wallet details of the user
 */
export const getUserAccountDetail = async (arg: {
  user: AuthUserType;
}): Promise<AccountDetailType[]> => {
  const { ROUTE_FETCH_USER_WALLETS } = await import("../routes.js");

  const resp = await fetch(ROUTE_FETCH_USER_WALLETS(), {
    headers: {
      Authorization: `Bearer ${arg.user.authToken}`,
    },
  });
  const result = await resp.json();
  return result as AccountDetailType[];
};

/**
 * Creates a new embedded wallet
 * @param arg - The options for creating a new embedded wallet
 * @param arg.client - The thirdweb client
 * @param arg.authUser - The authenticated user for which we want to create the wallet for
 * @param arg.format - The storage format for the wallet
 * @param arg.createAccountOverride - Optional. A function to override the default wallet creation function
 * @example
 * ```ts
 * import { createAccount } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 *
 * const account = await createAccount({
 *    client,
 *    authUser,
 *    format: "sharded",
 * });
 * console.log(account);
 * ```
 * @returns A Promise that resolves to the account details of the user
 */
export const createAccount = async ({
  createAccountOverride,
  client,
  authUser,
  format,
}: {
  createAccountOverride?: CreateAccountOverrideType | undefined;
  client: ThirdwebClient;
  authUser?: AuthUserType | undefined;
  format: WalletStorageFormatType;
}): Promise<SensitiveAccountDetailType> => {
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
  const { uuid: accountId } = await walletIdResp.json();

  if (createAccountOverride) {
    const wallet = await createAccountOverride();
    return {
      accountId,
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
    accountId,
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
 * @param arg.accountDetail - The wallet details to save
 * @param arg.storage - The storage option containing info to save the wallet
 * @example
 * ```ts
 * import { saveAccount } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 *
 * const account = await saveAccount({
 *   accountDetail,
 *   storage,
 * });
 * console.log(account);
 * ```
 * @returns A Promise that resolves to the account detail that was saved
 */
export const saveAccount = async ({
  storage,
  accountDetail,
}: {
  accountDetail: SensitiveAccountDetailType;
  storage: StorageType;
}): Promise<SensitiveAccountDetailType> => {
  const { keyMaterial } = accountDetail;
  const censoredAccountDetail: AccountDetailType = {
    address: accountDetail.address,
    client: accountDetail.client,
    userId: accountDetail.userId,
    walletState: accountDetail.walletState,
    createdAt: accountDetail.createdAt,
    format: accountDetail.format,
    keyGenerationSource: accountDetail.keyGenerationSource,
    accountId: accountDetail.accountId,
  };

  const { StorageError } = await import("../storage/error.js");

  switch (accountDetail.format) {
    case "privateKey": {
      if (!storage.privateKey) {
        throw new StorageError(
          'Missing "privateKey" Storage options. Please double check your storage type and make sure you set-up the "privateKey" storage.',
        );
      }
      await storage.privateKey.save({
        keyMaterial,
        authUser: storage.authUser,
        accountDetail: censoredAccountDetail,
        uniqueId: getWalletUniqueId(censoredAccountDetail, "pKey"),
      });
      break;
    }
    case "sharded": {
      if (!storage.sharded) {
        throw new StorageError(
          'Missing "sharded" Storage options. Please double check your storage type and make sure you set-up the "sharded" storage.',
        );
      }

      const {
        shares: [shareA, shareB, shareC],
      } = await createShares(keyMaterial);
      await Promise.all([
        storage.sharded.shareA.save({
          keyMaterial: shareA,
          authUser: storage.authUser,
          uniqueId: getWalletUniqueId(censoredAccountDetail, "shareA"),
          accountDetail: censoredAccountDetail,
        }),
        storage.sharded.shareB.save({
          keyMaterial: shareB,
          authUser: storage.authUser,
          uniqueId: getWalletUniqueId(censoredAccountDetail, "shareB"),
          accountDetail: censoredAccountDetail,
        }),
        storage.sharded.shareC.save({
          keyMaterial: shareC,
          authUser: storage.authUser,
          uniqueId: getWalletUniqueId(censoredAccountDetail, "shareC"),
          accountDetail: censoredAccountDetail,
        }),
      ]);
      break;
    }
  }
  return { ...accountDetail };
};

/**
 * Loads the embedded wallet from the storage
 * @param arg - The options for loading the wallet
 * @param arg.storage - The storage option containing info to load the wallet
 * @param arg.accountDetail - The wallet details to load
 * @example
 * ```ts
 * import { loadAccount } from "thirdweb/wallets/embedded-wallet/core/wallet/utils";
 *
 * const account = await loadAccount({
 *  storage,
 *  walletDetail,
 * });
 * console.log(account);
 * ```
 * @returns A Promise that resolves to the account detail that was passed in
 */
export const loadAccount = async ({
  storage,
  accountDetail,
}: {
  storage: StorageType;
  accountDetail: AccountDetailType;
}): Promise<SensitiveAccountDetailType> => {
  const { EmbeddedWalletError } = await import("./error.js");
  const { StorageError } = await import("../storage/error.js");

  switch (accountDetail.format) {
    case "privateKey": {
      if (!storage.privateKey) {
        throw new StorageError(
          'Missing "privateKey" Storage options. Please double check your storage type and make sure you set-up the privateKey storage.',
        );
      }

      const keyMaterial = await storage.privateKey.load({
        uniqueId: getWalletUniqueId(accountDetail, "pKey"),
        accountDetail,
        authUser: storage.authUser,
      });
      return {
        ...accountDetail,
        keyMaterial,
      };
    }
    case "sharded": {
      if (!storage.sharded) {
        throw new StorageError(
          'Missing "sharded" Storage options. Please double check your storage type and make sure you set-up the "sharded" storage.',
        );
      }

      const [shareA, shareB, shareC] = await Promise.all([
        storage.sharded.shareA.load({
          uniqueId: getWalletUniqueId(accountDetail, "shareA"),
          accountDetail,
          authUser: storage.authUser,
        }),
        storage.sharded.shareB.load({
          uniqueId: getWalletUniqueId(accountDetail, "shareB"),
          accountDetail,
          authUser: storage.authUser,
        }),
        storage.sharded.shareC.load({
          uniqueId: getWalletUniqueId(accountDetail, "shareC"),
          accountDetail,
          authUser: storage.authUser,
        }),
      ]);
      const shares = [shareA, shareB, shareC];
      const validShares = shares.filter((share) => !!share);
      if (validShares.length < 2) {
        throw new EmbeddedWalletError(
          `At least 2 valid shares are required to recreate account`,
        );
      }

      const keyMaterial = await combineShares(validShares);

      if (validShares.length === 2) {
        await saveAccount({
          storage,
          accountDetail: { ...accountDetail, keyMaterial },
        });
      }

      return {
        ...accountDetail,
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
