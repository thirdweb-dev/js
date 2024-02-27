import type { Chain } from "../src/types";
export default {
  "chain": "METER",
  "chainId": 82,
  "explorers": [
    {
      "name": "Meter Mainnet Scan",
      "url": "https://scan.meter.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.meter.io"
  ],
  "infoURL": "https://www.meter.io",
  "name": "Meter Mainnet",
  "nativeCurrency": {
    "name": "Meter",
    "symbol": "MTR",
    "decimals": 18
  },
  "networkId": 82,
  "rpc": [
    "https://82.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meter.io"
  ],
  "shortName": "Meter",
  "slug": "meter",
  "testnet": false
} as const satisfies Chain;