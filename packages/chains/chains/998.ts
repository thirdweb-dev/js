import type { Chain } from "../src/types";
export default {
  "chainId": 998,
  "chain": "LN",
  "name": "Lucky Network",
  "rpc": [
    "https://lucky-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.luckynetwork.org",
    "wss://ws.lnscan.org",
    "https://rpc.lnscan.org"
  ],
  "slug": "lucky-network",
  "icon": {
    "url": "ipfs://bafkreidmvcd5i7touug55hj45mf2pgabxamy5fziva7mtx5n664s3yap6m",
    "width": 205,
    "height": 28,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Lucky",
    "symbol": "L99",
    "decimals": 18
  },
  "infoURL": "https://luckynetwork.org",
  "shortName": "ln",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;