import type { Chain } from "../src/types";
export default {
  "chain": "BFT",
  "chainId": 355113,
  "explorers": [
    {
      "name": "Bitfinity Block Explorer",
      "url": "https://explorer.bitfinity.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://bitfinity.network/faucet"
  ],
  "features": [],
  "infoURL": "https://bitfinity.network",
  "name": "Bitfinity Network Testnet",
  "nativeCurrency": {
    "name": "BITFINITY",
    "symbol": "BFT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bitfinity-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitfinity.network"
  ],
  "shortName": "Bitfinity",
  "slug": "bitfinity-network-testnet",
  "testnet": true
} as const satisfies Chain;