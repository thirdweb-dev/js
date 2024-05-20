import type { Chain } from "../src/types";
export default {
  "chain": "Lambda",
  "chainId": 92001,
  "explorers": [
    {
      "name": "Lambda EVM Explorer",
      "url": "https://explorer.lambda.top",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.lambda.top"
  ],
  "infoURL": "https://lambda.im",
  "name": "Lambda Testnet",
  "nativeCurrency": {
    "name": "test-Lamb",
    "symbol": "LAMB",
    "decimals": 18
  },
  "networkId": 92001,
  "rpc": [
    "https://92001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.lambda.top/"
  ],
  "shortName": "lambda-testnet",
  "slip44": 1,
  "slug": "lambda-testnet",
  "testnet": true
} as const satisfies Chain;