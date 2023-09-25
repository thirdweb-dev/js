import type { Chain } from "../src/types";
export default {
  "chainId": 10947,
  "chain": "tQDC",
  "name": "Quadrans Blockchain Testnet",
  "rpc": [
    "https://quadrans-blockchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.quadrans.io",
    "https://rpctest2.quadrans.io"
  ],
  "slug": "quadrans-blockchain-testnet",
  "icon": {
    "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [
    "https://faucetpage.quadrans.io"
  ],
  "nativeCurrency": {
    "name": "Quadrans Testnet Coin",
    "symbol": "tQDC",
    "decimals": 18
  },
  "infoURL": "https://quadrans.io",
  "shortName": "quadranstestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.testnet.quadrans.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;