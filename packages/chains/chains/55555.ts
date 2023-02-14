export default {
  "name": "REI Chain Mainnet",
  "chain": "REI",
  "icon": {
    "url": "ipfs://QmNy5d5knHVjJJS9g4kLsh9i73RTjckpKL6KZvRk6ptbhf",
    "width": 591,
    "height": 591,
    "format": "svg"
  },
  "rpc": [
    "https://rei-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rei-rpc.moonrhythm.io"
  ],
  "faucets": [
    "http://kururu.finance/faucet?chainId=55555"
  ],
  "nativeCurrency": {
    "name": "Rei",
    "symbol": "REI",
    "decimals": 18
  },
  "infoURL": "https://reichain.io",
  "shortName": "reichain",
  "chainId": 55555,
  "networkId": 55555,
  "explorers": [
    {
      "name": "reiscan",
      "url": "https://reiscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "rei-chain"
} as const;