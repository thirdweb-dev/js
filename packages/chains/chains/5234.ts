import type { Chain } from "../src/types";
export default {
  "name": "Humanode Mainnet",
  "chain": "HMND",
  "rpc": [
    "https://humanode.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.mainnet.stages.humanode.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HMND",
    "symbol": "HMND",
    "decimals": 18
  },
  "infoURL": "https://humanode.io",
  "shortName": "hmnd",
  "chainId": 5234,
  "networkId": 5234,
  "explorers": [],
  "testnet": false,
  "slug": "humanode"
} as const satisfies Chain;