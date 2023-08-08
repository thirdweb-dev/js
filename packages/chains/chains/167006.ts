import type { Chain } from "../src/types";
export default {
  "name": "Taiko Eldfell L3",
  "chain": "ETH",
  "status": "active",
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "rpc": [
    "https://taiko-eldfell-l3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.l3test.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "shortName": "taiko-l3",
  "chainId": 167006,
  "networkId": 167006,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.l3test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "taiko-eldfell-l3"
} as const satisfies Chain;