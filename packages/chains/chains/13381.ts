import type { Chain } from "../src/types";
export default {
  "chainId": 13381,
  "chain": "Phoenix",
  "name": "Phoenix Mainnet",
  "rpc": [
    "https://phoenix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.phoenixplorer.com/"
  ],
  "slug": "phoenix",
  "icon": {
    "url": "ipfs://QmYiLMeKDXMSNuQmtxNdxm53xR588pcRXMf7zuiZLjQnc6",
    "width": 1501,
    "height": 1501,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Phoenix",
    "symbol": "PHX",
    "decimals": 18
  },
  "infoURL": "https://cryptophoenix.org/phoenix",
  "shortName": "Phoenix",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "phoenixplorer",
      "url": "https://phoenixplorer.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;