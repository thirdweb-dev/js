import localforage from "localforage";

function prefixKey(key: string) {
  return `tw_${key}`;
}
let connectorStorage: LocalForage;
export function getConnectorStorage() {
  if (!connectorStorage) {
    connectorStorage = localforage.createInstance({
      name: prefixKey("connectors"),
      storeName: prefixKey("connectors"),
      version: 1.0,
    });
  }

  return connectorStorage;
}

let coordinatorStorage: LocalForage;
export function getCoordinatorStorage() {
  if (!coordinatorStorage) {
    coordinatorStorage = localforage.createInstance({
      name: prefixKey("coordinator"),
      storeName: prefixKey("coordinator"),
      version: 1.0,
    });
  }

  return coordinatorStorage;
}

const walletStorage: Map<string, LocalForage> = new Map();
export function getWalletStorage(walletId: string) {
  let storage = walletStorage.get(walletId);

  if (!storage) {
    storage = localforage.createInstance({
      name: prefixKey(`wallet:${walletId}`),
      storeName: prefixKey(`wallet_${walletId}`),
      version: 1.0,
    });
    walletStorage.set(walletId, storage);
  }

  return storage;
}
