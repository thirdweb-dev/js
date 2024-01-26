let walletAnalyticsEnabled = true;

/**
 * Check if Wallet Analytics is enabled or not
 *
 * @example
 * ```ts
 * import { isWalletAnalyticsEnabled } from '@thirdweb/wallets';
 *
 * const isAnalyticsEnabled = isWalletAnalyticsEnabled();
 * ```
 *
 * The Wallet analytics can be used to track:
 * - Total and Unique users
 * - Users connected over time
 * - Type of wallets connected
 * - Distribution of wallets connected
 *
 * You can view these Analytics in the [ThirdWeb Wallet Analytics dashboard](https://thirdweb.com/dashboard/wallets/analytics)
 *
 * By default it is enabled. You can disable it by calling `setWalletAnalyticsEnabled(false)`
 *
 * ```ts
 * import { setWalletAnalyticsEnabled } from '@thirdweb/wallets';
 *
 * setWalletAnalyticsEnabled(false);
 * ```
 *
 */
export function isWalletAnalyticsEnabled() {
  return walletAnalyticsEnabled;
}

/**
 * Enable or disable Wallet Analytics
 *
 * @example
 * ```ts
 * import { setWalletAnalyticsEnabled } from '@thirdweb/wallets';
 *
 * setWalletAnalyticsEnabled(false);
 * ```
 *
 * The Wallet analytics can be used to track:
 * - Total and Unique users
 * - Users connected over time
 * - Type of wallets connected
 * - Distribution of wallets connected
 *
 * You can view these Analytics in the [ThirdWeb Wallet Analytics dashboard](https://thirdweb.com/dashboard/wallets/analytics)
 *
 * By default, The Wallet Analytics is enabled
 *
 * You can check if it is enabled or not by calling `isWalletAnalyticsEnabled()`
 * ```ts
 * import { isWalletAnalyticsEnabled } from '@thirdweb/wallets';
 *
 * const isAnalyticsEnabled = isWalletAnalyticsEnabled();
 * ```
 *
 */
export function setWalletAnalyticsEnabled(enabled: boolean) {
  walletAnalyticsEnabled = enabled;
}
