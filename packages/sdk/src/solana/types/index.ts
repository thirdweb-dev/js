/**
 * Supported Solana networks to use the SDK with
 *
 * @public
 */
export type Network =
  | "devnet"
  | "testnet"
  | "mainnet-beta"
  | "localnet"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});
