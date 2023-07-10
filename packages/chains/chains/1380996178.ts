import type { Chain } from "../src/types";
export default {
  "name": "RaptorChain",
  "chain": "RPTR",
  "rpc": [
    "https://raptorchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.raptorchain.io/web3"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Raptor",
    "symbol": "RPTR",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://raptorchain.io",
  "shortName": "rptr",
  "chainId": 1380996178,
  "networkId": 1380996178,
  "icon": {
    "url": "ipfs://QmQuvmiN6vM6Rqzqe1pMzDf8iZXqTtSeqCgGe5k5AyksDU",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "RaptorChain Explorer",
      "url": "https://explorer.raptorchain.io",
      "icon": {
        "url": "ipfs://QmQuvmiN6vM6Rqzqe1pMzDf8iZXqTtSeqCgGe5k5AyksDU",
        "width": 200,
        "height": 200,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "raptorchain"
} as const satisfies Chain;