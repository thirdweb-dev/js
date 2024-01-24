import type { ThirdwebClient } from "../../../client/client.js";
import type { AuthUserType } from "./authentication.type.js";
import type { StorageType, WalletStorageFormatType } from "./storage.type.js";
import type {
  CreateWalletOverrideType,
  SaveWalletArgType,
  SensitiveWalletDetailType,
  WalletDetailType,
} from "./wallet.type.js";

export const getWalletUniqueId = (
  walletDetail: WalletDetailType,
  keyPiece: "pKey" | "shareA" | "shareB" | "shareC",
) => {
  return `${walletDetail.walletId}-${keyPiece}`;
};

export const getUserWalletDetail = async (arg: { user: AuthUserType }) => {
  const { ROUTE_FETCH_USER_WALLETS } = await import("./routes.js");

  const resp = await fetch(ROUTE_FETCH_USER_WALLETS(), {
    headers: {
      Authorization: `Bearer ${arg.user.authToken}`,
    },
  });
  const result = await resp.json();
  return result as WalletDetailType[];
};

export const createWallet = async ({
  createWalletOverride,
  client,
  userId,
  format,
}: {
  createWalletOverride?: CreateWalletOverrideType | undefined;
  client: ThirdwebClient;
  userId?: string | undefined;
  format: WalletStorageFormatType;
}): Promise<SensitiveWalletDetailType> => {
  const { fakeUuid } = await import("../../../utils/uuid.js");

  if (createWalletOverride) {
    const wallet = await createWalletOverride();
    return {
      walletId: fakeUuid(),
      address: wallet.address,
      keyMaterial: wallet.privateKey,
      keyGenerationSource: "developer",
      client: client,
      userId: userId,
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
    walletId: fakeUuid(),
    address: account.address,
    keyMaterial: privateKey,
    keyGenerationSource: "thirdweb",
    client: client,
    userId: userId,
    walletState: "loaded",
    createdAt: Date.now(),
    format: format,
  };
};

export const saveWallet = async ({
  storage,
  walletDetail,
  isNew,
}: SaveWalletArgType): Promise<SensitiveWalletDetailType> => {
  const { EmbeddedWalletError } = await import("./wallet.error.js");
  const { ROUTE_NEW_STORAGE } = await import("./routes.js");

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

  let walletId: string = walletDetail.walletId;
  if (isNew) {
    const walletIdResp = await fetch(ROUTE_NEW_STORAGE(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storage.authUser?.authToken}`,
        "Content-Type": "application/json",
        body: JSON.stringify({
          walletId: walletDetail.walletId,
        }),
      },
    });
    if (!walletIdResp.ok) {
      throw new EmbeddedWalletError("Failed to create wallet");
    }
    ({ uuid: walletId } = await walletIdResp.json());
  }

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
  return { ...walletDetail, walletId };
};

export const loadWallet = async ({
  storage,
  walletDetail,
}: {
  storage: StorageType;
  walletDetail: WalletDetailType;
}): Promise<SensitiveWalletDetailType> => {
  const { EmbeddedWalletError } = await import("./wallet.error.js");
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
          uniqueId: getWalletUniqueId(walletDetail, "pKey"),
          walletDetail,
          authUser: storage.authUser,
        }),
        storage.shareB.load({
          uniqueId: getWalletUniqueId(walletDetail, "pKey"),
          walletDetail,
          authUser: storage.authUser,
        }),
        storage.shareC.load({
          uniqueId: getWalletUniqueId(walletDetail, "pKey"),
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
export async function createShares(keyMaterial: string): Promise<{
  shares: [string, string, string];
}> {
  const { share } = await import("secrets.js-34r7h");
  const { utf8ToHex } = await import("../../../utils/hex.js");
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

export async function combineShares(shares: string[]) {
  const { combine } = await import("secrets.js-34r7h");
  const { hexToUtf8 } = await import("../../../utils/hex.js");
  const { EmbeddedWalletError } = await import("./wallet.error.js");

  const privateKeyHex = combine(shares);
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
