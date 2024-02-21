import type { Chain } from "../src/types";
export default {
  "chain": "SCN",
  "chainId": 1904,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sportschainnetwork.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdW7XfRgeyoaHXEvXp8MaVteonankR32CxhL3K5Yc2uQM",
    "width": 345,
    "height": 321,
    "format": "png"
  },
  "infoURL": "https://sportschainnetwork.xyz",
  "name": "Sports Chain Network",
  "nativeCurrency": {
    "name": "SCN",
    "symbol": "SCN",
    "decimals": 18
  },
  "networkId": 1904,
  "rpc": [
    "https://1904.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sportschainnetwork.xyz/"
  ],
  "shortName": "SCN",
  "slug": "sports-chain-network",
  "testnet": false
} as const satisfies Chain;