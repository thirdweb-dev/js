import type { Chain } from "../src/types";
export default {
  "chainId": 788,
  "chain": "Aerochain",
  "name": "Aerochain Testnet",
  "rpc": [
    "https://aerochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.aerochain.id/"
  ],
  "slug": "aerochain-testnet",
  "faucets": [
    "https://faucet.aerochain.id/"
  ],
  "nativeCurrency": {
    "name": "Aerochain Testnet",
    "symbol": "TAero",
    "decimals": 18
  },
  "infoURL": "https://aerochaincoin.org/",
  "shortName": "taero",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "aeroscan",
      "url": "https://testnet.aeroscan.id",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;