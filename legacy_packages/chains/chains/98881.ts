import type { Chain } from "../src/types";
export default {
  "chain": "Ebi",
  "chainId": 98881,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ebi.xyz",
  "name": "Ebi Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 98881,
  "rpc": [
    "https://98881.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ebi.xyz"
  ],
  "shortName": "ebi",
  "slug": "ebi-chain",
  "status": "incubating",
  "testnet": false,
  "title": "Ebi Chain"
} as const satisfies Chain;