import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 167007,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.jolnir.taiko.xyz",
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
  "name": "Taiko Jolnir L2",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167007,
  "rpc": [
    "https://taiko-jolnir-l2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://167007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jolnir.taiko.xyz"
  ],
  "shortName": "tko-jolnir",
  "slug": "taiko-jolnir-l2",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;