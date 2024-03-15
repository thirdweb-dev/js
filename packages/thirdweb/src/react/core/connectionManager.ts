import { createConnectionManager } from "../../wallets/manager/index.js";
import { getStorage } from "./storage.js";

export const connectionManager = /* @__PURE__ */ createConnectionManager(
  /* @__PURE__ */ getStorage(),
);
