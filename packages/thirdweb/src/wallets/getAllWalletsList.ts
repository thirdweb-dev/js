/**
 * Hide it for documentation - but expose it because we will use this to render the list of wallets in docs website
 * Using dynamic import just to be extra safe and avoid any tree shaking issues
 * @internal
 */
export async function getAllWalletsList() {
  return (await import("./__generated__/wallet-infos.js")).default;
}
