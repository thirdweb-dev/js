import localforage from "localforage";

let connectorStorage: LocalForage;
export function getConnectorStorage() {
  if (!connectorStorage) {
    connectorStorage = localforage.createInstance({
      name: "connector-data",
      storeName: "connectors",
      version: 1.0,
    });
  }

  return connectorStorage;
}
