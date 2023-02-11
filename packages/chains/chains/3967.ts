export default {
  "name": "DYNO Testnet",
  "chain": "DYNO",
  "rpc": [
    "https://dyno-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.dynoprotocol.com"
  ],
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "tDYNO",
    "decimals": 18
  },
  "infoURL": "https://dynoprotocol.com",
  "shortName": "tdyno",
  "chainId": 3967,
  "networkId": 3967,
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://testnet.dynoscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dyno-testnet"
} as const;