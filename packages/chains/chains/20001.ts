import type { Chain } from "../src/types";
export default {
  "chain": "ETHW",
  "chainId": 20001,
  "explorers": [
    {
      "name": "CamelarkScan",
      "url": "https://scan.camelark.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmeJerrsURFNt2LL7DE7TxeunjrQXiuezdfHyqmsbwX3MZ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://www.camelark.com",
  "name": "Camelark Mainnet",
  "nativeCurrency": {
    "name": "EthereumPoW",
    "symbol": "ETHW",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://camelark.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-http-rpc.camelark.com"
  ],
  "shortName": "Camelark",
  "slug": "camelark",
  "testnet": false
} as const satisfies Chain;