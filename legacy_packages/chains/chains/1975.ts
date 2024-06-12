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
  "infoURL": "https://onuschain.io",
  "name": "ONUS Chain Mainnet",
  "nativeCurrency": {
    "name": "ONUS",
    "symbol": "ONUS",
    "decimals": 18
  },
  "networkId": 1975,
  "rpc": [
    "https://1975.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io"
  ],
  "shortName": "onus-mainnet",
  "slug": "onus-chain",
  "testnet": false,
  "title": "ONUS Chain Mainnet"
} as const satisfies Chain;