import type { Chain } from "../src/types";
export default {
  "chainId": 997,
  "chain": "5ireChain",
  "name": "5ireChain Thunder",
  "rpc": [
    "https://5irechain-thunder.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.5ire.network"
  ],
  "slug": "5irechain-thunder",
  "icon": {
    "url": "ipfs://QmaZDNDFLWESH4i3XqwEWfWBb1HPnQSNbDAr74nr2x8QAk",
    "width": 800,
    "height": 800,
    "format": "svg"
  },
  "faucets": [
    "https://explorer.5ire.network/faucet"
  ],
  "nativeCurrency": {
    "name": "5ire Token",
    "symbol": "5ire",
    "decimals": 18
  },
  "infoURL": "https://5ire.org",
  "shortName": "5ire",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "5ireChain Explorer",
      "url": "https://explorer.5ire.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;