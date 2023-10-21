import type { Chain } from "../src/types";
export default {
  "chain": "tKLC",
  "chainId": 104,
  "explorers": [
    {
      "name": "kaibascan",
      "url": "https://kaibascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeihbsw3ky7yf6llpww6fabo4dicotcgwjpefscoxrppstjx25dvtea",
    "width": 932,
    "height": 932,
    "format": "png"
  },
  "infoURL": "https://kaibadefi.com",
  "name": "Kaiba Lightning Chain Testnet",
  "nativeCurrency": {
    "name": "Kaiba Testnet Token",
    "symbol": "tKAIBA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kaiba-lightning-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://klc.live/"
  ],
  "shortName": "tklc",
  "slug": "kaiba-lightning-chain-testnet",
  "testnet": true
} as const satisfies Chain;