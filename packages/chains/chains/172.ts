import type { Chain } from "../src/types";
export default {
  "name": "Latam-Blockchain Resil Testnet",
  "chain": "Resil",
  "rpc": [],
  "faucets": [
    "https://faucet.latam-blockchain.com"
  ],
  "nativeCurrency": {
    "name": "Latam-Blockchain Resil Test Native Token",
    "symbol": "usd",
    "decimals": 18
  },
  "infoURL": "https://latam-blockchain.com",
  "shortName": "resil",
  "chainId": 172,
  "networkId": 172,
  "testnet": true,
  "slug": "latam-blockchain-resil-testnet"
} as const satisfies Chain;