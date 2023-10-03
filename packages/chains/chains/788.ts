import type { Chain } from "../src/types";
export default {
  "chain": "Aerochain",
  "chainId": 788,
  "explorers": [
    {
      "name": "aeroscan",
      "url": "https://testnet.aeroscan.id",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.aerochain.id/"
  ],
  "features": [],
  "infoURL": "https://aerochaincoin.org/",
  "name": "Aerochain Testnet",
  "nativeCurrency": {
    "name": "Aerochain Testnet",
    "symbol": "TAero",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aerochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.aerochain.id/"
  ],
  "shortName": "taero",
  "slug": "aerochain-testnet",
  "testnet": true
} as const satisfies Chain;