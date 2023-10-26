import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1701,
  "explorers": [
    {
      "name": "Anytype Explorer",
      "url": "https://explorer.anytype.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmaARJiAQUn4Z6wG8GLEry3kTeBB3k6RfHzSZU9SPhBgcG",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://evm.anytype.io/faucet"
  ],
  "icon": {
    "url": "ipfs://QmaARJiAQUn4Z6wG8GLEry3kTeBB3k6RfHzSZU9SPhBgcG",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://evm.anytype.io",
  "name": "Anytype EVM Chain",
  "nativeCurrency": {
    "name": "ANY",
    "symbol": "ANY",
    "decimals": 18
  },
  "networkId": 1701,
  "rpc": [
    "https://anytype-evm-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1701.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.anytype.io"
  ],
  "shortName": "AnytypeChain",
  "slug": "anytype-evm-chain",
  "testnet": false
} as const satisfies Chain;