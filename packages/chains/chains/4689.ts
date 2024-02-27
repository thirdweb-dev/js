import type { Chain } from "../src/types";
export default {
  "chain": "iotex.io",
  "chainId": 4689,
  "explorers": [
    {
      "name": "iotexscan",
      "url": "https://iotexscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQKHQrvtyUC5b5B76ke5GPTGXoGTVCubXS6gHgzCAswKo",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://iotex.io",
  "name": "IoTeX Network Mainnet",
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "networkId": 4689,
  "redFlags": [],
  "rpc": [
    "https://4689.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/iotex",
    "https://babel-api.mainnet.iotex.io"
  ],
  "shortName": "iotex-mainnet",
  "slug": "iotex-network",
  "testnet": false
} as const satisfies Chain;