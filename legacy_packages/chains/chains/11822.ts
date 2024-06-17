import type { Chain } from "../src/types";
export default {
  "chain": "Artela",
  "chainId": 11822,
  "explorers": [
    {
      "name": "ArtelaScan",
      "url": "https://betanet-scan.artela.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://artela.network/",
  "name": "Artela Testnet",
  "nativeCurrency": {
    "name": "ART",
    "symbol": "ART",
    "decimals": 18
  },
  "networkId": 11822,
  "rpc": [
    "https://11822.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://betanet-rpc1.artela.network"
  ],
  "shortName": "Artela",
  "slug": "artela-testnet",
  "testnet": true
} as const satisfies Chain;