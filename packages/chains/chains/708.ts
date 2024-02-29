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
  "infoURL": "https://blockchainstation.io",
  "name": "BlockChain Station Testnet",
  "nativeCurrency": {
    "name": "BCS Testnet Token",
    "symbol": "tBCS",
    "decimals": 18
  },
  "networkId": 708,
  "rpc": [
    "https://708.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bcsdev.io",
    "wss://rpc-ws-testnet.bcsdev.io"
  ],
  "shortName": "tbcs",
  "slip44": 1,
  "slug": "blockchain-station-testnet",
  "testnet": true
} as const satisfies Chain;