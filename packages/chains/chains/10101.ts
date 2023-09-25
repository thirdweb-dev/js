import type { Chain } from "../src/types";
export default {
  "chainId": 10101,
  "chain": "GEN",
  "name": "Blockchain Genesis Mainnet",
  "rpc": [
    "https://blockchain-genesis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eu.mainnet.xixoio.com",
    "https://us.mainnet.xixoio.com",
    "https://asia.mainnet.xixoio.com"
  ],
  "slug": "blockchain-genesis",
  "faucets": [],
  "nativeCurrency": {
    "name": "GEN",
    "symbol": "GEN",
    "decimals": 18
  },
  "infoURL": "https://www.xixoio.com/",
  "shortName": "GEN",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;