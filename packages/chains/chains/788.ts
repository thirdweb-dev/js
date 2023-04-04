import type { Chain } from "../src/types";
export default {
  "name": "Aerochain Testnet",
  "chain": "Aerochain",
  "rpc": [
    "https://aerochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.aerochain.id/"
  ],
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
  "chainId": 788,
  "networkId": 788,
  "explorers": [
    {
      "name": "aeroscan",
      "url": "https://testnet.aeroscan.id",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "aerochain-testnet"
} as const satisfies Chain;