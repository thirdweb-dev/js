import type { Chain } from "../src/types";
export default {
  "chain": "5ireChain",
  "chainId": 997,
  "explorers": [
    {
      "name": "5ireChain Explorer",
      "url": "https://explorer.5ire.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://explorer.5ire.network/faucet"
  ],
  "infoURL": "https://5ire.org",
  "name": "5ireChain Thunder",
  "nativeCurrency": {
    "name": "5ire Token",
    "symbol": "5ire",
    "decimals": 18
  },
  "networkId": 997,
  "rpc": [
    "https://997.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.5ire.network"
  ],
  "shortName": "5ire",
  "slug": "5irechain-thunder",
  "testnet": true
} as const satisfies Chain;