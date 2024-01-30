import { createConnectionManager } from "../wallets/index.js";

export const connectionManager = /* @__PURE__ */ createConnectionManager({
  storage: {
    async get(key) {
      return localStorage.getItem(key);
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
    async remove(key) {
      localStorage.removeItem(key);
    },
  },
});
