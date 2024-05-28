import type { Chain } from "../src/types";
export default {
  "chain": "NEURA",
  "chainId": 268,
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
  "name": "Neura Devnet",
  "nativeCurrency": {
    "name": "Devnet Ankr",
    "symbol": "ANKR",
    "decimals": 18
  },
  "networkId": 268,
  "rpc": [],
  "shortName": "dneura",
  "slip44": 1,
  "slug": "neura-devnet",
  "status": "incubating",
  "testnet": false,
  "title": "Neura Devnet"
} as const satisfies Chain;