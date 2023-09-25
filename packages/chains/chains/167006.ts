import type { Chain } from "../src/types";
export default {
  "chainId": 167006,
  "chain": "ETH",
  "name": "Taiko Eldfell L3",
  "rpc": [
    "https://taiko-eldfell-l3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.l3test.taiko.xyz"
  ],
  "slug": "taiko-eldfell-l3",
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "shortName": "taiko-l3",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.l3test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;