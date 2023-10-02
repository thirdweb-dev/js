import type { Chain } from "../src/types";
export default {
  "chain": "onus",
  "chainId": 1975,
  "explorers": [
    {
      "name": "Onus explorer mainnet",
      "url": "https://explorer.onuschain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://onuschain.io",
  "name": "ONUS Chain Mainnet",
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://onus-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io"
  ],
  "shortName": "onus-mainnet",
  "slug": "onus-chain",
  "testnet": false
} as const satisfies Chain;