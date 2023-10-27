import type { Chain } from "../src/types";
export default {
  "chain": "DYNO",
  "chainId": 3966,
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://dynoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "infoURL": "https://dynoprotocol.com",
  "name": "DYNO Mainnet",
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "DYNO",
    "decimals": 18
  },
  "networkId": 3966,
  "rpc": [
    "https://dyno.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3966.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.dynoprotocol.com"
  ],
  "shortName": "dyno",
  "slug": "dyno",
  "testnet": false
} as const satisfies Chain;