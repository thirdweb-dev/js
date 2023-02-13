export default {
  "name": "Meter Mainnet",
  "chain": "METER",
  "rpc": [
    "https://meter.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meter.io"
  ],
  "faucets": [
    "https://faucet.meter.io"
  ],
  "nativeCurrency": {
    "name": "Meter",
    "symbol": "MTR",
    "decimals": 18
  },
  "infoURL": "https://www.meter.io",
  "shortName": "Meter",
  "chainId": 82,
  "networkId": 82,
  "explorers": [
    {
      "name": "Meter Mainnet Scan",
      "url": "https://scan.meter.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "meter"
} as const;