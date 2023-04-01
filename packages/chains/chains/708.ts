import type { Chain } from "../src/types";
export default {
  "name": "BlockChain Station Testnet",
  "chain": "BCS",
  "rpc": [],
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
  "chainId": 708,
  "networkId": 708,
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://testnet.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "blockchain-station-testnet"
} as const satisfies Chain;