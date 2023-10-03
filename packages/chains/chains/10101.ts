import type { Chain } from "../src/types";
export default {
  "chain": "GEN",
  "chainId": 10101,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.xixoio.com/",
  "name": "Blockchain Genesis Mainnet",
  "nativeCurrency": {
    "name": "GEN",
    "symbol": "GEN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://blockchain-genesis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eu.mainnet.xixoio.com",
    "https://us.mainnet.xixoio.com",
    "https://asia.mainnet.xixoio.com"
  ],
  "shortName": "GEN",
  "slug": "blockchain-genesis",
  "testnet": false
} as const satisfies Chain;