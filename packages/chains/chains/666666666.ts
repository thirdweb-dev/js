import type { Chain } from "../src/types";
export default {
  "chain": "Degen",
  "chainId": 666666666,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmb6yAe4wXeBkxjfhxzoUT9TzETcmE7Vne59etm9GJaQf7",
    "width": 789,
    "height": 668,
    "format": "svg"
  },
  "infoURL": "https://degen.tips",
  "name": "Degen Chain",
  "nativeCurrency": {
    "name": "DEGEN",
    "symbol": "DEGEN",
    "decimals": 18
  },
  "networkId": 666666666,
  "rpc": [
    "https://666666666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.degen.tips"
  ],
  "shortName": "degen-chain",
  "slug": "degen-chain",
  "status": "incubating",
  "testnet": false,
  "title": "Degen Chain"
} as const satisfies Chain;