import type { Chain } from "../src/types";
export default {
  "chainId": 651940,
  "chain": "ALL",
  "name": "ALL Mainnet",
  "rpc": [
    "https://all.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.alltra.global"
  ],
  "slug": "all",
  "icon": {
    "url": "ipfs://bafkreibqe2mgiqezi24sx272kunqt6pv7uzxhpkxuobvpbsptce3q6nn5i",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ALL",
    "symbol": "ALL",
    "decimals": 18
  },
  "infoURL": "https://alltra.world",
  "shortName": "ALL",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Alltra SmartChain Explorer",
      "url": "https://alltra.global",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;