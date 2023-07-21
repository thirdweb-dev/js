import type { Chain } from "../src/types";
export default {
  "name": "ALL Mainnet",
  "chain": "ALL",
  "icon": {
    "url": "ipfs://bafkreibqe2mgiqezi24sx272kunqt6pv7uzxhpkxuobvpbsptce3q6nn5i",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://all.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.alltra.global"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ALL",
    "symbol": "ALL",
    "decimals": 18
  },
  "infoURL": "https://alltra.world",
  "shortName": "ALL",
  "chainId": 651940,
  "networkId": 651940,
  "explorers": [
    {
      "name": "Alltra SmartChain Explorer",
      "url": "https://alltra.global",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "all"
} as const satisfies Chain;