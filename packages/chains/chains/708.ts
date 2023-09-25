import type { Chain } from "../src/types";
export default {
  "chainId": 708,
  "chain": "BCS",
  "name": "BlockChain Station Testnet",
  "rpc": [
    "https://blockchain-station-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bcsdev.io",
    "wss://rpc-ws-testnet.bcsdev.io"
  ],
  "slug": "blockchain-station-testnet",
  "faucets": [
    "https://faucet.bcsdev.io"
  ],
  "nativeCurrency": {
    "name": "BCS Testnet Token",
    "symbol": "tBCS",
    "decimals": 18
  },
  "infoURL": "https://blockchainstation.io",
  "shortName": "tbcs",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://testnet.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;