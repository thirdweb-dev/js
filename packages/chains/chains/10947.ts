import type { Chain } from "../src/types";
export default {
  "chain": "tQDC",
  "chainId": 10947,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.testnet.quadrans.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucetpage.quadrans.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://quadrans.io",
  "name": "Quadrans Blockchain Testnet",
  "nativeCurrency": {
    "name": "Quadrans Testnet Coin",
    "symbol": "tQDC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quadrans-blockchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.quadrans.io",
    "https://rpctest2.quadrans.io"
  ],
  "shortName": "quadranstestnet",
  "slug": "quadrans-blockchain-testnet",
  "testnet": true
} as const satisfies Chain;