import type { Chain } from "../src/types";
export default {
  "chain": "Lambda Chain",
  "chainId": 56026,
  "explorers": [
    {
      "name": "Lambda Chain Mainnet Explorer",
      "url": "https://scan.lambda.im",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXCWjWSTd6kJZKnH9aQRjgLdWRH9NTxU1wC21iBvoB4Hp",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://lambda.im",
  "name": "Lambda Chain Mainnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 56026,
  "rpc": [
    "https://56026.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nrpc.lambda.im/"
  ],
  "shortName": "lambda",
  "slip44": 1,
  "slug": "lambda-chain",
  "testnet": false
} as const satisfies Chain;