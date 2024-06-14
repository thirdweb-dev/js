import { webLocalStorage } from "../../utils/storage/webStorage.js";
import { connectionManagerSingleton } from "../core/connectionManager.js";

export const connectionManager = connectionManagerSingleton(webLocalStorage);
