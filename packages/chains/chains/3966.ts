import type { Chain } from "../src/types";
export default {
  "chainId": 3966,
  "chain": "DYNO",
  "name": "DYNO Mainnet",
  "rpc": [
    "https://dyno.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.dynoprotocol.com"
  ],
  "slug": "dyno",
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "tDYNO",
    "decimals": 18
  },
  "infoURL": "https://dynoprotocol.com",
  "shortName": "dyno",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://dynoscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;