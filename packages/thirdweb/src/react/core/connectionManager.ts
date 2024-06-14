import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import {
  type ConnectionManager,
  createConnectionManager,
} from "../../wallets/manager/index.js";

let _connectManager: ConnectionManager;

export function connectionManagerSingleton(storage: AsyncStorage) {
  if (_connectManager) {
    return _connectManager;
  }
  return createConnectionManager(storage);
}
