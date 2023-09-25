import type { Chain } from "../src/types";
export default {
  "chainId": 1380996178,
  "chain": "RPTR",
  "name": "RaptorChain",
  "rpc": [
    "https://raptorchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.raptorchain.io/web3"
  ],
  "slug": "raptorchain",
  "icon": {
    "url": "ipfs://QmQuvmiN6vM6Rqzqe1pMzDf8iZXqTtSeqCgGe5k5AyksDU",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Raptor",
    "symbol": "RPTR",
    "decimals": 18
  },
  "infoURL": "https://raptorchain.io",
  "shortName": "rptr",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "RaptorChain Explorer",
      "url": "https://explorer.raptorchain.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;