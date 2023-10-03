import type { Chain } from "../src/types";
export default {
  "chain": "DYNO",
  "chainId": 3967,
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://testnet.dynoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "features": [],
  "infoURL": "https://dynoprotocol.com",
  "name": "DYNO Testnet",
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "DYNO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dyno-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.dynoprotocol.com"
  ],
  "shortName": "tdyno",
  "slug": "dyno-testnet",
  "testnet": true
} as const satisfies Chain;