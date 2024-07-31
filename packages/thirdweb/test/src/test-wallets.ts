import { inAppWallet } from "../../src/wallets/in-app/web/in-app.js";
import { privateKeyToAccount } from "../../src/wallets/private-key.js";
import { TEST_CLIENT } from "./test-clients.js";

export const ANVIL_PKEY_A =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
export const ANVIL_PKEY_B =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
export const ANVIL_PKEY_C =
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
export const ANVIL_PKEY_D =
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";

export const TEST_ACCOUNT_A = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_A,
});
export const TEST_IN_APP_WALLET_A = (() => {
  const w = inAppWallet();
  w.getAccount = () => TEST_ACCOUNT_A;
  return w;
})();

export const TEST_ACCOUNT_B = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_B,
});

export const TEST_ACCOUNT_C = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_C,
});

export const TEST_ACCOUNT_D = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_D,
});
