import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1802203764,
  "explorers": [
    {
      "name": "Kakarot Scan",
      "url": "https://sepolia.kakarotscan.org",
      "standard": "EIP3091"
    },
    {
      "name": "Kakarot Explorer",
      "url": "https://sepolia-explorer.kakarot.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://kakarot.org",
  "name": "Kakarot Sepolia",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1802203764,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [
    "https://1802203764.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.kakarot.org"
  ],
  "shortName": "kkrt-sepolia",
  "slug": "kakarot-sepolia",
  "testnet": false
} as const satisfies Chain;