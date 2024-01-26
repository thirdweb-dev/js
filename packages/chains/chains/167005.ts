import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167005,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "infoURL": "https://taiko.xyz",
  "name": "Taiko Grimsvotn L2",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167005,
  "rpc": [
    "https://taiko-grimsvotn-l2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://167005.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.taiko.xyz"
  ],
  "shortName": "taiko-l2",
  "slug": "taiko-grimsvotn-l2",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;