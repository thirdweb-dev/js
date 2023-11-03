import type { Chain } from "../types";
export default {
  "chain": "ETC",
  "chainId": 6,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://explorer.jade.builders/?network=kotti",
  "name": "Ethereum Classic Testnet Kotti",
  "nativeCurrency": {
    "name": "Kotti Ether",
    "symbol": "KOT",
    "decimals": 18
  },
  "networkId": 6,
  "rpc": [
    "https://ethereum-classic-testnet-kotti.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.ethercluster.com/kotti"
  ],
  "shortName": "kot",
  "slug": "ethereum-classic-testnet-kotti",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;