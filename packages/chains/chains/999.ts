import type { Chain } from "../src/types";
export default {
  "name": "Zora Testnet",
  "chain": "ETH",
  "rpc": [
    "https://zora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.zora.co/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "GETH",
    "decimals": 18
  },
  "icon": {
    "url": "ipfs://QmZ6qaRwTPFEZUspwMUjaxC6KhmzcELdRQcQzS3P72Dzts/Vector.svg",
    "height": 512,
    "width": 512,
    "format": "svg"
  },
  "shortName": "Zora",
  "chainId": 999,
  "networkId": 999,
  "testnet": true,
  "slug": "zora-testnet"
} as const satisfies Chain;