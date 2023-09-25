import type { Chain } from "../src/types";
export default {
  "chainId": 92001,
  "chain": "Lambda",
  "name": "Lambda Testnet",
  "rpc": [
    "https://lambda-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.lambda.top/"
  ],
  "slug": "lambda-testnet",
  "icon": {
    "url": "ipfs://QmWsoME6LCghQTpGYf7EnUojaDdYo7kfkWVjE6VvNtkjwy",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [
    "https://faucet.lambda.top"
  ],
  "nativeCurrency": {
    "name": "test-Lamb",
    "symbol": "LAMB",
    "decimals": 18
  },
  "infoURL": "https://lambda.im",
  "shortName": "lambda-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Lambda EVM Explorer",
      "url": "https://explorer.lambda.top",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;