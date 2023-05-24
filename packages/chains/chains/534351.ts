import type { Chain } from "../src/types";
export default {
  "name": "Scroll Sepolia Testnet",
  "chain": "ETH",
  "status": "incubating",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr-sepolia",
  "chainId": 534351,
  "networkId": 534351,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "testnet": true,
  "slug": "scroll-sepolia-testnet"
} as const satisfies Chain;