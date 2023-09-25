import type { Chain } from "../src/types";
export default {
  "chainId": 8098,
  "chain": "StreamuX",
  "name": "StreamuX Blockchain",
  "rpc": [
    "https://streamux-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://u0ma6t6heb:KDNwOsRDGcyM2Oeui1p431Bteb4rvcWkuPgQNHwB4FM@u0xy4x6x82-u0e2mg517m-rpc.us0-aws.kaleido.io/"
  ],
  "slug": "streamux-blockchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "StreamuX",
    "symbol": "SmuX",
    "decimals": 18
  },
  "infoURL": "https://www.streamux.cloud",
  "shortName": "StreamuX",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;