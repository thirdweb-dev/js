import type { Chain } from "../src/types";
export default {
  "chainId": 172,
  "chain": "Resil",
  "name": "Latam-Blockchain Resil Testnet",
  "rpc": [
    "https://latam-blockchain-resil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.latam-blockchain.com",
    "wss://ws.latam-blockchain.com"
  ],
  "slug": "latam-blockchain-resil-testnet",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;