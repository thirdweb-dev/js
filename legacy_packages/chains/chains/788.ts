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
  "infoURL": "https://aerochaincoin.org/",
  "name": "Aerochain Testnet",
  "nativeCurrency": {
    "name": "Aerochain Testnet",
    "symbol": "TAero",
    "decimals": 18
  },
  "networkId": 788,
  "rpc": [
    "https://788.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.aerochain.id/"
  ],
  "shortName": "taero",
  "slip44": 1,
  "slug": "aerochain-testnet",
  "testnet": true
} as const satisfies Chain;