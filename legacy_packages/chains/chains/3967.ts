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
  "infoURL": "https://dynoprotocol.com",
  "name": "DYNO Testnet",
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "tDYNO",
    "decimals": 18
  },
  "networkId": 3967,
  "rpc": [
    "https://3967.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.dynoprotocol.com"
  ],
  "shortName": "tdyno",
  "slip44": 1,
  "slug": "dyno-testnet",
  "testnet": true
} as const satisfies Chain;