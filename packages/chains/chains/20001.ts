import type { Chain } from "../src/types";
export default {
  "chainId": 20001,
  "chain": "ETHW",
  "name": "Camelark Mainnet",
  "rpc": [
    "https://camelark.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-http-rpc.camelark.com"
  ],
  "slug": "camelark",
  "icon": {
    "url": "ipfs://QmeJerrsURFNt2LL7DE7TxeunjrQXiuezdfHyqmsbwX3MZ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EthereumPoW",
    "symbol": "ETHW",
    "decimals": 18
  },
  "infoURL": "https://www.camelark.com",
  "shortName": "Camelark",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "CamelarkScan",
      "url": "https://scan.camelark.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;