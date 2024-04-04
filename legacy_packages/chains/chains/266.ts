import type { Chain } from "../src/types";
export default {
  "chain": "NEURA",
  "chainId": 266,
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
  "name": "Neura",
  "nativeCurrency": {
    "name": "Ankr",
    "symbol": "ANKR",
    "decimals": 18
  },
  "networkId": 266,
  "rpc": [],
  "shortName": "neura",
  "slug": "neura",
  "status": "incubating",
  "testnet": false,
  "title": "Neura Mainnet"
} as const satisfies Chain;