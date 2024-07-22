import type { Chain } from "../src/types";
export default {
  "chain": "SWAN",
  "chainId": 254,
  "explorers": [
    {
      "name": "Swanchain Explorer",
      "url": "https://swanscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://swanchain.io/",
  "name": "Swan Chain Mainnet",
  "nativeCurrency": {
    "name": "SWANETH",
    "symbol": "sETH",
    "decimals": 18
  },
  "networkId": 254,
  "rpc": [
    "https://254.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc01.swanchain.io"
  ],
  "shortName": "Swan",
  "slug": "swan-chain",
  "testnet": false
} as const satisfies Chain;