import type { Chain } from "../src/types";
export default {
  "chain": "BCS",
  "chainId": 708,
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://testnet.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bcsdev.io"
  ],
  "features": [],
  "infoURL": "https://blockchainstation.io",
  "name": "BlockChain Station Testnet",
  "nativeCurrency": {
    "name": "BCS Testnet Token",
    "symbol": "tBCS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://blockchain-station-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bcsdev.io",
    "wss://rpc-ws-testnet.bcsdev.io"
  ],
  "shortName": "tbcs",
  "slug": "blockchain-station-testnet",
  "testnet": true
} as const satisfies Chain;