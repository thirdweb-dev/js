export default {
  "name": "Empire Network",
  "chain": "EMPIRE",
  "rpc": [
    "https://empire-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.empirenetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Empire",
    "symbol": "EMPIRE",
    "decimals": 18
  },
  "infoURL": "https://www.empirenetwork.io/",
  "shortName": "empire",
  "chainId": 3693,
  "networkId": 3693,
  "explorers": [
    {
      "name": "Empire Explorer",
      "url": "https://explorer.empirenetwork.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "empire-network"
} as const;