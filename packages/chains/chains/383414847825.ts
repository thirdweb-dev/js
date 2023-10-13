import type { Chain } from "../src/types";
export default {
  "chain": "ZENIQ",
  "chainId": 383414847825,
  "explorers": [
    {
      "name": "zeniq-smart-chain-explorer",
      "url": "https://smart.zeniq.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.zeniq.net/"
  ],
  "features": [],
  "infoURL": "https://www.zeniq.dev/",
  "name": "Zeniq",
  "nativeCurrency": {
    "name": "Zeniq",
    "symbol": "ZENIQ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://zeniq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://smart.zeniq.network:9545"
  ],
  "shortName": "zeniq",
  "slug": "zeniq",
  "testnet": false
} as const satisfies Chain;