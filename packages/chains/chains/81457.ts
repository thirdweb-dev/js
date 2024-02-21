import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 81457,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeifc2h3x7jgy4x4nmg2m54ghbvmkfu6oweujambwefzqzew5vujhsi",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://blast.io/",
  "name": "Blast",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 81457,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [],
  "shortName": "blastmainnet",
  "slug": "blast-blastmainnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;