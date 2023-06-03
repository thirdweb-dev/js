import type { Chain } from "../src/types";
export default {
  "name": "Taiko (Alpha-3 Testnet)",
  "chain": "ETH",
  "status": "active",
  "icon": {
    "url": "ipfs://QmcHdmVr5VRUJq13jnM6tgah5Ge7hn3Dm14eY6vwivJ5ui",
    "width": 288,
    "height": 258,
    "format": "png"
  },
  "rpc": [
    "https://taiko-alpha-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "shortName": "taiko-a3",
  "chainId": 167005,
  "networkId": 167005,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "taiko-alpha-3-testnet"
} as const satisfies Chain;