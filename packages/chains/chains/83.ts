import type { Chain } from "../src/types";
export default {
  "chainId": 83,
  "chain": "METER Testnet",
  "name": "Meter Testnet",
  "rpc": [
    "https://meter-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.meter.io"
  ],
  "slug": "meter-testnet",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Meter Testnet Scan",
      "url": "https://scan-warringstakes.meter.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;