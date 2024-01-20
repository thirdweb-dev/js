import type { Chain } from "../src/types";
export default {
  "chain": "Evoke",
  "chainId": 31414,
  "explorers": [
    {
      "name": "Evoke SmartChain Testnet Explorer",
      "url": "https://testnet-explorer.evokescan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.evokescan.org"
  ],
  "icon": {
    "url": "ipfs://bafkreia5q26knsvxgkwxze7woepvsqat5n2hodokh4ozzphmhexqez5s34",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "infoURL": "https://testnet-explorer.evokescan.org",
  "name": "Evoke Testnet",
  "nativeCurrency": {
    "name": "MTHN Testnet",
    "symbol": "MTHN",
    "decimals": 18
  },
  "networkId": 31414,
  "rpc": [
    "https://evoke-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://31414.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.evokescan.org"
  ],
  "shortName": "tmthn",
  "slug": "evoke-testnet",
  "testnet": true
} as const satisfies Chain;