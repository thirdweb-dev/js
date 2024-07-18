import type { Chain } from "../src/types";
export default {
  "chain": "Automata Testnet",
  "chainId": 1398243,
  "explorers": [
    {
      "name": "Automata Testnet Explorer",
      "url": "https://automata-testnet-explorer.alt.technology",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW7ugm31MRdhjGtimzWMK5N4g5L84tSyKMpZQYk6N9KvJ",
    "width": 1676,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://ata.network",
  "name": "Automata Testnet",
  "nativeCurrency": {
    "name": "ATA",
    "symbol": "ATA",
    "decimals": 18
  },
  "networkId": 1398243,
  "rpc": [
    "https://1398243.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://automata-testnet.alt.technology"
  ],
  "shortName": "automatatest",
  "slug": "automata-testnet",
  "testnet": true
} as const satisfies Chain;