import type { Chain } from "../src/types";
export default {
  "chain": "Gold",
  "chainId": 4653,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://gold.dev",
  "name": "Gold Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4653,
  "rpc": [
    "https://4653.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.gold.dev"
  ],
  "shortName": "gold",
  "slug": "gold-chain",
  "status": "incubating",
  "testnet": false,
  "title": "Gold Chain"
} as const satisfies Chain;