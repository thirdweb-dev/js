import type { Chain } from "../src/types";
export default {
  "chain": "RPTR",
  "chainId": 1380996178,
  "explorers": [
    {
      "name": "RaptorChain Explorer",
      "url": "https://explorer.raptorchain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQuvmiN6vM6Rqzqe1pMzDf8iZXqTtSeqCgGe5k5AyksDU",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmQuvmiN6vM6Rqzqe1pMzDf8iZXqTtSeqCgGe5k5AyksDU",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://raptorchain.io",
  "name": "RaptorChain",
  "nativeCurrency": {
    "name": "Raptor",
    "symbol": "RPTR",
    "decimals": 18
  },
  "networkId": 1380996178,
  "rpc": [
    "https://1380996178.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.raptorchain.io/web3"
  ],
  "shortName": "rptr",
  "slug": "raptorchain",
  "testnet": false
} as const satisfies Chain;