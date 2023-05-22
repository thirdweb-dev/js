import type { Chain } from "../src/types";
export default {
  "name": "Camelark Mainnet",
  "chainId": 20001,
  "shortName": "Camelark",
  "chain": "ETHW",
  "icon": {
    "url": "ipfs://QmeJerrsURFNt2LL7DE7TxeunjrQXiuezdfHyqmsbwX3MZ",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "networkId": 20001,
  "nativeCurrency": {
    "name": "EthereumPoW",
    "symbol": "ETHW",
    "decimals": 18
  },
  "rpc": [
    "https://camelark.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-http-rpc.camelark.com"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "CamelarkScan",
      "url": "https://scan.camelark.com",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://www.camelark.com",
  "testnet": false,
  "slug": "camelark"
} as const satisfies Chain;