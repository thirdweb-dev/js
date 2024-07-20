import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 107107114116,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQcB7Q2kqVWhJxXmtN9Ri37rcLH9g6z4UCCYqEzgM3XmW",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
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