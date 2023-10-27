import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 999,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZ6qaRwTPFEZUspwMUjaxC6KhmzcELdRQcQzS3P72Dzts/Vector.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "name": "Zora Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "GETH",
    "decimals": 18
  },
  "networkId": 999,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://zora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.zora.co/"
  ],
  "shortName": "zora-testnet",
  "slug": "zora-testnet",
  "testnet": true
} as const satisfies Chain;