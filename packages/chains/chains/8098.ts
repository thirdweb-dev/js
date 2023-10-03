import type { Chain } from "../src/types";
export default {
  "chain": "StreamuX",
  "chainId": 8098,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.streamux.cloud",
  "name": "StreamuX Blockchain",
  "nativeCurrency": {
    "name": "StreamuX",
    "symbol": "SmuX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://streamux-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://u0ma6t6heb:KDNwOsRDGcyM2Oeui1p431Bteb4rvcWkuPgQNHwB4FM@u0xy4x6x82-u0e2mg517m-rpc.us0-aws.kaleido.io/"
  ],
  "shortName": "StreamuX",
  "slug": "streamux-blockchain",
  "testnet": false
} as const satisfies Chain;