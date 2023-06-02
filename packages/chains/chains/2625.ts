import type { Chain } from "../src/types";
export default {
  "name": "WhiteBIT Network Testnet",
  "chain": "WBT",
  "rpc": [
    "https://whitebit-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.whitebit.network"
  ],
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
  "chainId": 2625,
  "networkId": 2625,
  "icon": {
    "url": "ipfs://QmQqAAn2F98TH5ouRyvReKxQdaGKjE7WJQPEPW6mFFVXUT",
    "width": 32,
    "height": 32,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "wb-explorer-testnet",
      "url": "https://explorer.whitebit.network/testnet",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "whitebit-network-testnet"
} as const satisfies Chain;