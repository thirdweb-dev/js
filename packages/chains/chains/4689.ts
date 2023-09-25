import type { Chain } from "../src/types";
export default {
  "chainId": 4689,
  "chain": "iotex.io",
  "name": "IoTeX Network Mainnet",
  "rpc": [
    "https://iotex-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://babel-api.mainnet.iotex.io"
  ],
  "slug": "iotex-network",
  "icon": {
    "url": "ipfs://QmQKHQrvtyUC5b5B76ke5GPTGXoGTVCubXS6gHgzCAswKo",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "infoURL": "https://iotex.io",
  "shortName": "iotex-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "iotexscan",
      "url": "https://iotexscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;