import type { Chain } from "../src/types";
export default {
  "chainId": 104,
  "chain": "tKLC",
  "name": "Kaiba Lightning Chain Testnet",
  "rpc": [
    "https://kaiba-lightning-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://klc.live/"
  ],
  "slug": "kaiba-lightning-chain-testnet",
  "icon": {
    "url": "ipfs://bafybeihbsw3ky7yf6llpww6fabo4dicotcgwjpefscoxrppstjx25dvtea",
    "width": 932,
    "height": 932,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Kaiba Testnet Token",
    "symbol": "tKAIBA",
    "decimals": 18
  },
  "infoURL": "https://kaibadefi.com",
  "shortName": "tklc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "kaibascan",
      "url": "https://kaibascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;