import type { Chain } from "../src/types";
export default {
  "chainId": 3967,
  "chain": "DYNO",
  "name": "DYNO Testnet",
  "rpc": [
    "https://dyno-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.dynoprotocol.com"
  ],
  "slug": "dyno-testnet",
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "tDYNO",
    "decimals": 18
  },
  "infoURL": "https://dynoprotocol.com",
  "shortName": "tdyno",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://testnet.dynoscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;