import { createConnectionManager } from "../wallets/manager/index.js";
import { asyncLocalStorage } from "./utils/asyncLocalStorage.js";

export const connectionManager =
  /* @__PURE__ */ createConnectionManager(asyncLocalStorage);
