import type { Chain } from "../src/types";
export default {
  "chain": "METER Testnet",
  "chainId": 83,
  "explorers": [
    {
      "name": "Meter Testnet Scan",
      "url": "https://scan-warringstakes.meter.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-warringstakes.meter.io"
  ],
  "infoURL": "https://www.meter.io",
  "name": "Meter Testnet",
  "nativeCurrency": {
    "name": "Meter",
    "symbol": "MTR",
    "decimals": 18
  },
  "networkId": 83,
  "rpc": [
    "https://meter-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://83.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.meter.io"
  ],
  "shortName": "MeterTest",
  "slug": "meter-testnet",
  "testnet": true
} as const satisfies Chain;