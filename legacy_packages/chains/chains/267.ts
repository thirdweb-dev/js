import type { Chain } from "../src/types";
export default {
  "chain": "NEURA",
  "chainId": 267,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmWdpK5WFKrosaCSpJRCvU7uXeKk2qVeCckTxh6Zw2JrK8",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://www.neuraprotocol.io/",
  "name": "Neura Testnet",
  "nativeCurrency": {
    "name": "Testnet Ankr",
    "symbol": "ANKR",
    "decimals": 18
  },
  "networkId": 267,
  "rpc": [],
  "shortName": "tneura",
  "slip44": 1,
  "slug": "neura-testnet",
  "status": "incubating",
  "testnet": true,
  "title": "Neura Testnet"
} as const satisfies Chain;