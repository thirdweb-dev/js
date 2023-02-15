export default {
  "name": "Lambda Testnet",
  "chain": "Lambda",
  "rpc": [
    "https://lambda-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.lambda.top/"
  ],
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
  "chainId": 92001,
  "networkId": 92001,
  "icon": {
    "url": "ipfs://QmWsoME6LCghQTpGYf7EnUojaDdYo7kfkWVjE6VvNtkjwy",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Lambda EVM Explorer",
      "url": "https://explorer.lambda.top",
      "standard": "EIP3091",
      "icon": "lambda"
    }
  ],
  "testnet": true,
  "slug": "lambda-testnet"
} as const;