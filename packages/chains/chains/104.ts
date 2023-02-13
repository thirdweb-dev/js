export default {
  "name": "Kaiba Lightning Chain Testnet",
  "chain": "tKLC",
  "rpc": [
    "https://kaiba-lightning-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://klc.live/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kaiba Testnet Token",
    "symbol": "tKAIBA",
    "decimals": 18
  },
  "infoURL": "https://kaibadefi.com",
  "shortName": "tklc",
  "chainId": 104,
  "networkId": 104,
  "icon": {
    "url": "ipfs://bafybeihbsw3ky7yf6llpww6fabo4dicotcgwjpefscoxrppstjx25dvtea",
    "width": 932,
    "height": 932,
    "format": "png"
  },
  "explorers": [
    {
      "name": "kaibascan",
      "url": "https://kaibascan.io",
      "icon": "kaibascan",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kaiba-lightning-chain-testnet"
} as const;