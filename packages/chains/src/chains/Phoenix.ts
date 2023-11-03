import type { Chain } from "../types";
export default {
  "chain": "Phoenix",
  "chainId": 13381,
  "explorers": [
    {
      "name": "phoenixplorer",
      "url": "https://phoenixplorer.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYiLMeKDXMSNuQmtxNdxm53xR588pcRXMf7zuiZLjQnc6",
    "width": 1501,
    "height": 1501,
    "format": "png"
  },
  "infoURL": "https://cryptophoenix.org/phoenix",
  "name": "Phoenix Mainnet",
  "nativeCurrency": {
    "name": "Phoenix",
    "symbol": "PHX",
    "decimals": 18
  },
  "networkId": 13381,
  "rpc": [
    "https://phoenix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://13381.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.phoenixplorer.com/"
  ],
  "shortName": "Phoenix",
  "slug": "phoenix",
  "testnet": false
} as const satisfies Chain;