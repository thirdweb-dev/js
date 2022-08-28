export type Network =
  | "devnet"
  | "testnet"
  | "mainnet-beta"
  | "localhost"
  | (string & {});
