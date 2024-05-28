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
  "infoURL": "https://quadrans.io",
  "name": "Quadrans Blockchain Testnet",
  "nativeCurrency": {
    "name": "Quadrans Testnet Coin",
    "symbol": "tQDC",
    "decimals": 18
  },
  "networkId": 10947,
  "rpc": [
    "https://10947.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.quadrans.io",
    "https://rpctest2.quadrans.io"
  ],
  "shortName": "quadranstestnet",
  "slip44": 1,
  "slug": "quadrans-blockchain-testnet",
  "testnet": true
} as const satisfies Chain;