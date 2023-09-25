import type { Chain } from "../src/types";
export default {
  "chainId": 383414847825,
  "chain": "ZENIQ",
  "name": "Zeniq",
  "rpc": [
    "https://zeniq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://smart.zeniq.network:9545"
  ],
  "slug": "zeniq",
  "faucets": [
    "https://faucet.zeniq.net/"
  ],
  "nativeCurrency": {
    "name": "Zeniq",
    "symbol": "ZENIQ",
    "decimals": 18
  },
  "infoURL": "https://www.zeniq.dev/",
  "shortName": "zeniq",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "zeniq-smart-chain-explorer",
      "url": "https://smart.zeniq.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;