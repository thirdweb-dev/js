import {
  createVaultAccessToken as createVaultAccessTokenAction,
  createVaultServerWallet as createVaultServerWalletAction,
  createVaultServiceAccount as createVaultServiceAccountAction,
  listVaultAccessTokens as listVaultAccessTokensAction,
  listVaultServerWallets as listVaultServerWalletsAction,
  revokeVaultAccessToken as revokeVaultAccessTokenAction,
  rotateVaultServiceAccount as rotateVaultServiceAccountAction,
  setVaultProjectWallet as setVaultProjectWalletAction,
  type VaultActionResult,
} from "./vault-actions";

export type { VaultCredentials } from "./vault-actions";

function unwrapped<P, T>(action: (params: P) => Promise<VaultActionResult<T>>) {
  return async (params: P): Promise<T> => {
    const result = await action(params);
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  };
}

export const createVaultAccessToken = unwrapped(createVaultAccessTokenAction);
export const createVaultServerWallet = unwrapped(createVaultServerWalletAction);
export const createVaultServiceAccount = unwrapped(
  createVaultServiceAccountAction,
);
export const listVaultAccessTokens = unwrapped(listVaultAccessTokensAction);
export const listVaultServerWallets = unwrapped(listVaultServerWalletsAction);
export const revokeVaultAccessToken = unwrapped(revokeVaultAccessTokenAction);
export const rotateVaultServiceAccount = unwrapped(
  rotateVaultServiceAccountAction,
);
export const setVaultProjectWallet = unwrapped(setVaultProjectWalletAction);
