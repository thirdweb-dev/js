import type { Chain } from "../src/types";
export default {
  "chainId": 82,
  "chain": "METER",
  "name": "Meter Mainnet",
  "rpc": [
    "https://meter.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meter.io"
  ],
  "slug": "meter",
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Meter Mainnet Scan",
      "url": "https://scan.meter.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;