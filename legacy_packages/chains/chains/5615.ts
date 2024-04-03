import type { Chain } from "../src/types";
export default {
  "chain": "Arcturus",
  "chainId": 5615,
  "explorers": [
    {
      "name": "explorer-arcturus-testnet",
      "url": "https://testnet.arcscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.arcturuschain.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://arcturuschain.io",
  "name": "Arcturus Testneet",
  "nativeCurrency": {
    "name": "tARC",
    "symbol": "tARC",
    "decimals": 18
  },
  "networkId": 5615,
  "rpc": [
    "https://5615.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.arcturuschain.io/"
  ],
  "shortName": "arcturus-testnet",
  "slug": "arcturus-testneet",
  "testnet": true
} as const satisfies Chain;