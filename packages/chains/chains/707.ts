import type { Chain } from "../src/types";
export default {
  "chain": "BCS",
  "chainId": 707,
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://explorer.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://blockchainstation.io",
  "name": "BlockChain Station Mainnet",
  "nativeCurrency": {
    "name": "BCS Token",
    "symbol": "BCS",
    "decimals": 18
  },
  "networkId": 707,
  "rpc": [
    "https://707.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.bcsdev.io",
    "wss://rpc-ws-mainnet.bcsdev.io"
  ],
  "shortName": "bcs",
  "slug": "blockchain-station",
  "testnet": false
} as const satisfies Chain;