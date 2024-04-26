import type { Chain } from "../src/types";
export default {
  "chain": "Lambda Chain",
  "chainId": 17000920,
  "explorers": [
    {
      "name": "Lambda Chain Testnet Explorer",
      "url": "https://testscan.lambda.im",
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
  "name": "Lambda Chain Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 17000920,
  "rpc": [
    "https://17000920.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnrpc.lambda.im/"
  ],
  "shortName": "tlambda",
  "slip44": 1,
  "slug": "lambda-chain-testnet",
  "testnet": true
} as const satisfies Chain;