import type { Chain } from "../src/types";
export default {
  "chain": "Bronos",
  "chainId": 1038,
  "explorers": [
    {
      "name": "Bronos Testnet Explorer",
      "url": "https://tbroscan.bronos.org",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.bronos.org"
  ],
  "infoURL": "https://bronos.org",
  "name": "Bronos Testnet",
  "nativeCurrency": {
    "name": "tBRO",
    "symbol": "tBRO",
    "decimals": 18
  },
  "networkId": 1038,
  "rpc": [
    "https://1038.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.bronos.org"
  ],
  "shortName": "bronos-testnet",
  "slip44": 1,
  "slug": "bronos-testnet",
  "testnet": true
} as const satisfies Chain;