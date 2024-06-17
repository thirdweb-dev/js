import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 107107114116,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://kakarot.org",
  "name": "Kakarot Sepolia Deprecated",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 107107114116,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [],
  "shortName": "kkrt-sepolia-deprecated",
  "slug": "kakarot-sepolia-deprecated",
  "testnet": false
} as const satisfies Chain;