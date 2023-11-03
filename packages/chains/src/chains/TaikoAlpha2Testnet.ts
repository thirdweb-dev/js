import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 167004,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.a2.taiko.xyz",
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
  "name": "Taiko (Alpha-2 Testnet)",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 167004,
  "rpc": [
    "https://taiko-alpha-2-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://167004.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.a2.taiko.xyz"
  ],
  "shortName": "taiko-a2",
  "slug": "taiko-alpha-2-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;