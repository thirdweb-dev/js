import { generatePrivateKey } from "viem/accounts";
import { createWalletAdapter } from "../adapters/wallet-adapter.js";
import { ethereum } from "../chains/chain-definitions/ethereum.js";
import { createThirdwebClient } from "../client/client.js";
import type { SiweAuthOptions } from "../react/core/hooks/auth/useSiweAuth.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { privateKeyToAccount } from "../wallets/private-key.js";

const clientId = process.env.STORYBOOK_CLIENT_ID;

if (!clientId) {
  throw new Error("STORYBOOK_CLIENT_ID env is not configured");
}

export const storyClient = createThirdwebClient({
  clientId: clientId,
});

export const storyAccount: Account = privateKeyToAccount({
  client: storyClient,
  privateKey: process.env.STORYBOOK_ACCOUNT_PRIVATE_KEY || generatePrivateKey(),
});

export const storyWallet = createWalletAdapter({
  adaptedAccount: storyAccount,
  client: storyClient,
  chain: ethereum,
  onDisconnect: () => {},
  switchChain: () => {},
});

export const storyAuthStub: SiweAuthOptions = {
  async doLogin() {
    localStorage.setItem("story.isLoggedIn", "true");
  },
  async doLogout() {
    localStorage.setItem("story.isLoggedIn", "false");
  },
  async getLoginPayload(params) {
    return {
      nonce: "",
      signature: "",
      address: params.address,
      domain: "",
      expiration_time: "",
      invalid_before: "",
      issued_at: "",
      version: "",
      statement: "",
    };
  },
  async isLoggedIn() {
    return localStorage.getItem("story.sLoggedIn") === "true";
  },
};
