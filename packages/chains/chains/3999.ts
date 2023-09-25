import type { Chain } from "../src/types";
export default {
  "chainId": 3999,
  "chain": "YCC",
  "name": "YuanChain Mainnet",
  "rpc": [
    "https://yuanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.yuan.org/eth"
  ],
  "slug": "yuanchain",
  "icon": {
    "url": "ipfs://QmdbPhiB5W2gbHZGkYsN7i2VTKKP9casmAN2hRnpDaL9W4",
    "width": 96,
    "height": 96,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "YCC",
    "symbol": "YCC",
    "decimals": 18
  },
  "infoURL": "https://www.yuan.org",
  "shortName": "ycc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "YuanChain Explorer",
      "url": "https://mainnet.yuan.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;