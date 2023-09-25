import type { Chain } from "../src/types";
export default {
  "chainId": 167007,
  "chain": "ETH",
  "name": "Taiko Jolnir L2",
  "rpc": [
    "https://taiko-jolnir-l2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jolnir.taiko.xyz"
  ],
  "slug": "taiko-jolnir-l2",
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
  "shortName": "tko-jolnir",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.jolnir.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;