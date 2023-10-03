import type { Chain } from "../src/types";
export default {
  "chain": "YCC",
  "chainId": 3999,
  "explorers": [
    {
      "name": "YuanChain Explorer",
      "url": "https://mainnet.yuan.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmdbPhiB5W2gbHZGkYsN7i2VTKKP9casmAN2hRnpDaL9W4",
    "width": 96,
    "height": 96,
    "format": "png"
  },
  "infoURL": "https://www.yuan.org",
  "name": "YuanChain Mainnet",
  "nativeCurrency": {
    "name": "YCC",
    "symbol": "YCC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://yuanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.yuan.org/eth"
  ],
  "shortName": "ycc",
  "slug": "yuanchain",
  "testnet": false
} as const satisfies Chain;