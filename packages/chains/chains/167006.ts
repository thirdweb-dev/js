import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167006,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.l3test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "infoURL": "https://taiko.xyz",
  "name": "Taiko Eldfell L3",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://taiko-eldfell-l3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.l3test.taiko.xyz"
  ],
  "shortName": "taiko-l3",
  "slug": "taiko-eldfell-l3",
  "status": "active",
  "testnet": true
} as const satisfies Chain;