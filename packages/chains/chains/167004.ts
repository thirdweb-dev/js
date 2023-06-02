import type { Chain } from "../src/types";
export default {
  "name": "Taiko (Alpha-2 Testnet)",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "rpc": [
    "https://taiko-alpha-2-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.a2.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "shortName": "taiko-a2",
  "chainId": 167004,
  "networkId": 167004,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.a2.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "taiko-alpha-2-testnet"
} as const satisfies Chain;