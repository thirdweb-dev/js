export default {
  "name": "Meter Testnet",
  "chain": "METER Testnet",
  "rpc": [
    "https://meter-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.meter.io"
  ],
  "faucets": [
    "https://faucet-warringstakes.meter.io"
  ],
  "nativeCurrency": {
    "name": "Meter",
    "symbol": "MTR",
    "decimals": 18
  },
  "infoURL": "https://www.meter.io",
  "shortName": "MeterTest",
  "chainId": 83,
  "networkId": 83,
  "explorers": [
    {
      "name": "Meter Testnet Scan",
      "url": "https://scan-warringstakes.meter.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "meter-testnet"
} as const;