export default {
  "name": "Anytype EVM Chain",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmaARJiAQUn4Z6wG8GLEry3kTeBB3k6RfHzSZU9SPhBgcG",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "rpc": [
    "https://anytype-evm-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.anytype.io"
  ],
  "faucets": [
    "https://evm.anytype.io/faucet"
  ],
  "nativeCurrency": {
    "name": "ANY",
    "symbol": "ANY",
    "decimals": 18
  },
  "infoURL": "https://evm.anytype.io",
  "shortName": "AnytypeChain",
  "chainId": 1701,
  "networkId": 1701,
  "explorers": [
    {
      "name": "Anytype Explorer",
      "url": "https://explorer.anytype.io",
      "icon": "any",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "anytype-evm-chain"
} as const;