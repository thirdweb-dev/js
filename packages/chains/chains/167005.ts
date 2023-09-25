import type { Chain } from "../src/types";
export default {
  "chainId": 167005,
  "chain": "ETH",
  "name": "Taiko Grimsvotn L2",
  "rpc": [
    "https://taiko-grimsvotn-l2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.taiko.xyz"
  ],
  "slug": "taiko-grimsvotn-l2",
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
  "shortName": "taiko-l2",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;