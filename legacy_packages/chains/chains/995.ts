import type { Chain } from "../src/types";
export default {
  "chain": "5ireChain",
  "chainId": 995,
  "explorers": [
    {
      "name": "5ireChain Explorer",
      "url": "https://5irescan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmaZDNDFLWESH4i3XqwEWfWBb1HPnQSNbDAr74nr2x8QAk",
        "width": 800,
        "height": 800,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaZDNDFLWESH4i3XqwEWfWBb1HPnQSNbDAr74nr2x8QAk",
    "width": 800,
    "height": 800,
    "format": "svg"
  },
  "infoURL": "https://5ire.org",
  "name": "5ireChain Mainnet",
  "nativeCurrency": {
    "name": "5ire Token",
    "symbol": "5IRE",
    "decimals": 18
  },
  "networkId": 995,
  "rpc": [
    "https://995.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.5ire.network"
  ],
  "shortName": "5ire",
  "slug": "5irechain",
  "testnet": false
} as const satisfies Chain;