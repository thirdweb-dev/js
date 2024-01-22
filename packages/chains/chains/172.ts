import type { Chain } from "../src/types";
export default {
  "chain": "Resil",
  "chainId": 172,
  "explorers": [],
  "faucets": [
    "https://faucet.latam-blockchain.com"
  ],
  "infoURL": "https://latam-blockchain.com",
  "name": "Latam-Blockchain Resil Testnet",
  "nativeCurrency": {
    "name": "Latam-Blockchain Resil Test Native Token",
    "symbol": "usd",
    "decimals": 18
  },
  "networkId": 172,
  "rpc": [
    "https://latam-blockchain-resil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://172.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.latam-blockchain.com",
    "wss://ws.latam-blockchain.com"
  ],
  "shortName": "resil",
  "slip44": 1,
  "slug": "latam-blockchain-resil-testnet",
  "testnet": true
} as const satisfies Chain;