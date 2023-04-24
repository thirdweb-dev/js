import type { Chain } from "../src/types";
export default {
  "name": "5ireChain Thunder",
  "chain": "5ireChain",
  "rpc": [
    "https://5irechain-thunder.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.5ire.network"
  ],
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
  "chainId": 997,
  "networkId": 997,
  "icon": {
    "url": "ipfs://QmaZDNDFLWESH4i3XqwEWfWBb1HPnQSNbDAr74nr2x8QAk",
    "width": 800,
    "height": 800,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "5ireChain Explorer",
      "url": "https://explorer.5ire.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmaZDNDFLWESH4i3XqwEWfWBb1HPnQSNbDAr74nr2x8QAk",
        "width": 800,
        "height": 800,
        "format": "svg"
      }
    }
  ],
  "testnet": true,
  "slug": "5irechain-thunder"
} as const satisfies Chain;