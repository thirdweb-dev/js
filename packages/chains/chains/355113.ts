import type { Chain } from "../src/types";
export default {
  "chainId": 355113,
  "chain": "BFT",
  "name": "Bitfinity Network Testnet",
  "rpc": [
    "https://bitfinity-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitfinity.network"
  ],
  "slug": "bitfinity-network-testnet",
  "faucets": [
    "https://bitfinity.network/faucet"
  ],
  "nativeCurrency": {
    "name": "BITFINITY",
    "symbol": "BFT",
    "decimals": 18
  },
  "infoURL": "https://bitfinity.network",
  "shortName": "Bitfinity",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitfinity Block Explorer",
      "url": "https://explorer.bitfinity.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;