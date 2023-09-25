import type { Chain } from "../src/types";
export default {
  "chainId": 2625,
  "chain": "WBT",
  "name": "WhiteBIT Network Testnet",
  "rpc": [
    "https://whitebit-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.whitebit.network"
  ],
  "slug": "whitebit-network-testnet",
  "icon": {
    "url": "ipfs://QmQqAAn2F98TH5ouRyvReKxQdaGKjE7WJQPEPW6mFFVXUT",
    "width": 32,
    "height": 32,
    "format": "svg"
  },
  "faucets": [
    "https://explorer.whitebit.network/testnet/faucet"
  ],
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "infoURL": "https://whitebit.com/wbt",
  "shortName": "twbt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "wb-explorer-testnet",
      "url": "https://explorer.whitebit.network/testnet",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;