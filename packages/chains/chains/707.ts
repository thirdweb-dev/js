import type { Chain } from "../src/types";
export default {
  "chainId": 707,
  "chain": "BCS",
  "name": "BlockChain Station Mainnet",
  "rpc": [
    "https://blockchain-station.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.bcsdev.io",
    "wss://rpc-ws-mainnet.bcsdev.io"
  ],
  "slug": "blockchain-station",
  "faucets": [],
  "nativeCurrency": {
    "name": "BCS Token",
    "symbol": "BCS",
    "decimals": 18
  },
  "infoURL": "https://blockchainstation.io",
  "shortName": "bcs",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://explorer.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;