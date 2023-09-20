import type { Chain } from "../src/types";
export default {
  "name": "Taiko Jolnir L2",
  "chain": "ETH",
  "status": "incubating",
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "rpc": [
    "https://taiko-jolnir-l2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jolnir.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "shortName": "tko-jolnir",
  "chainId": 167007,
  "networkId": 167007,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.jolnir.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "taiko-jolnir-l2"
} as const satisfies Chain;