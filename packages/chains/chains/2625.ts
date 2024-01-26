import type { Chain } from "../src/types";
export default {
  "chain": "WBT",
  "chainId": 2625,
  "explorers": [
    {
      "name": "wb-explorer-testnet",
      "url": "https://explorer.whitebit.network/testnet",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://explorer.whitebit.network/testnet/faucet"
  ],
  "icon": {
    "url": "ipfs://QmQqAAn2F98TH5ouRyvReKxQdaGKjE7WJQPEPW6mFFVXUT",
    "width": 32,
    "height": 32,
    "format": "svg"
  },
  "infoURL": "https://whitebit.com/wbt",
  "name": "WhiteBIT Network Testnet",
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "networkId": 2625,
  "rpc": [
    "https://whitebit-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2625.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.whitebit.network"
  ],
  "shortName": "twbt",
  "slip44": 1,
  "slug": "whitebit-network-testnet",
  "testnet": true
} as const satisfies Chain;