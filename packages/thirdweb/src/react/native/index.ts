import { nativeLocalStorage } from "../../utils/storage/nativeStorage.js";
import { connectionManagerSingleton } from "../core/connectionManager.js";

export const connectionManager = connectionManagerSingleton(nativeLocalStorage);
