export default {
  "name": "DYNO Mainnet",
  "chain": "DYNO",
  "rpc": [
    "https://dyno.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.dynoprotocol.com"
  ],
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "DYNO",
    "decimals": 18
  },
  "infoURL": "https://dynoprotocol.com",
  "shortName": "dyno",
  "chainId": 3966,
  "networkId": 3966,
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://dynoscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dyno"
} as const;