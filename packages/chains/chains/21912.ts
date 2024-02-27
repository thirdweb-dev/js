import type { Chain } from "../src/types";
export default {
  "chain": "BSL",
  "chainId": 21912,
  "explorers": [
    {
      "name": "BSL Mainnet Explorer",
      "url": "https://scan.nftruth.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://bsquarelab.com/",
  "name": "BSL Mainnet",
  "nativeCurrency": {
    "name": "Origin NFT",
    "symbol": "ONF",
    "decimals": 18
  },
  "networkId": 21912,
  "rpc": [
    "https://21912.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc-mainnet.nftruth.io:8545",
    "ws://rpc-mainnet.nftruth.io:8645"
  ],
  "shortName": "onf",
  "slug": "bsl",
  "testnet": false
} as const satisfies Chain;