import type { Chain } from "../src/types";
export default {
  "chain": "Satori",
  "chainId": 14801,
  "explorers": [
    {
      "name": "satoriscan",
      "url": "https://satori.vanascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.vana.org"
  ],
  "infoURL": "https://satori.vana.org",
  "name": "Vana Satori Testnet",
  "nativeCurrency": {
    "name": "DAT",
    "symbol": "DAT",
    "decimals": 18
  },
  "networkId": 14801,
  "rpc": [
    "https://14801.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.satori.vana.org"
  ],
  "shortName": "satori",
  "slug": "vana-satori-testnet",
  "testnet": true
} as const satisfies Chain;