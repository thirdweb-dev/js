import type { Chain } from "../src/types";
export default {
  "chainId": 1701,
  "chain": "ETH",
  "name": "Anytype EVM Chain",
  "rpc": [
    "https://anytype-evm-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.anytype.io"
  ],
  "slug": "anytype-evm-chain",
  "icon": {
    "url": "ipfs://QmaARJiAQUn4Z6wG8GLEry3kTeBB3k6RfHzSZU9SPhBgcG",
    "width": 200,
    "height": 200,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Anytype Explorer",
      "url": "https://explorer.anytype.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;