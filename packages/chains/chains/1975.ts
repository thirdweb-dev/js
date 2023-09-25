import type { Chain } from "../src/types";
export default {
  "chainId": 1975,
  "chain": "onus",
  "name": "ONUS Chain Mainnet",
  "rpc": [
    "https://onus-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io"
  ],
  "slug": "onus-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "infoURL": "https://onuschain.io",
  "shortName": "onus-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Onus explorer mainnet",
      "url": "https://explorer.onuschain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;