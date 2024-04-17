import { privateKeyToAccount } from "../../src/wallets/private-key.js";
import { TEST_CLIENT } from "./test-clients.js";

export const ANVIL_PKEY_A =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
export const ANVIL_PKEY_B =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

export const TEST_ACCOUNT_A = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_A,
});

export const TEST_ACCOUNT_B = privateKeyToAccount({
  client: TEST_CLIENT,
  privateKey: ANVIL_PKEY_B,
});
