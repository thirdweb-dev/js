import type { Chain } from "../src/types";
export default {
  "chain": "ALL",
  "chainId": 651940,
  "explorers": [
    {
      "name": "Alltra SmartChain Explorer",
      "url": "https://alltra.global",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreibqe2mgiqezi24sx272kunqt6pv7uzxhpkxuobvpbsptce3q6nn5i",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://alltra.world",
  "name": "ALL Mainnet",
  "nativeCurrency": {
    "name": "ALL",
    "symbol": "ALL",
    "decimals": 18
  },
  "networkId": 651940,
  "rpc": [
    "https://651940.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.alltra.global"
  ],
  "shortName": "ALL",
  "slug": "all",
  "testnet": false
} as const satisfies Chain;