import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 1313161560,
  "explorers": [
    {
      "name": "PowerGold explorer",
      "url": "https://explorer.powergold.aurora.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreib2sabb6vgfoskobp2wdr6if7v6s34f2xwjecfceui6qhjudmu4u4",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.powergold.tech",
  "name": "PowerGold",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1313161560,
  "rpc": [
    "https://powergold.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1313161560.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://powergold.aurora.dev"
  ],
  "shortName": "powergold",
  "slug": "powergold",
  "testnet": false
} as const satisfies Chain;