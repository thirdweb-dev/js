import type { Chain } from "../src/types";
export default {
  "chain": "LN",
  "chainId": 998,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.luckynetwork.org",
      "standard": "none"
    },
    {
      "name": "expedition",
      "url": "https://lnscan.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreidmvcd5i7touug55hj45mf2pgabxamy5fziva7mtx5n664s3yap6m",
    "width": 205,
    "height": 28,
    "format": "png"
  },
  "infoURL": "https://luckynetwork.org",
  "name": "Lucky Network",
  "nativeCurrency": {
    "name": "Lucky",
    "symbol": "L99",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lucky-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.luckynetwork.org",
    "wss://ws.lnscan.org",
    "https://rpc.lnscan.org"
  ],
  "shortName": "ln",
  "slug": "lucky-network",
  "testnet": false
} as const satisfies Chain;