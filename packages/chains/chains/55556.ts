export default {
  "name": "REI Chain Testnet",
  "chain": "REI",
  "icon": {
    "url": "ipfs://QmNy5d5knHVjJJS9g4kLsh9i73RTjckpKL6KZvRk6ptbhf",
    "width": 591,
    "height": 591,
    "format": "svg"
  },
  "rpc": [
    "https://rei-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-testnet-rpc.moonrhythm.io"
  ],
  "faucets": [
    "http://kururu.finance/faucet?chainId=55556"
  ],
  "nativeCurrency": {
    "name": "tRei",
    "symbol": "tREI",
    "decimals": 18
  },
  "infoURL": "https://reichain.io",
  "shortName": "trei",
  "chainId": 55556,
  "networkId": 55556,
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://testnet.reiscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "rei-chain-testnet"
} as const;