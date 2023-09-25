import type { Chain } from "../src/types";
export default {
  "chainId": 444,
  "chain": "ETH",
  "name": "Synapse Chain Testnet",
  "rpc": [
    "https://synapse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.synapseprotocol.com"
  ],
  "slug": "synapse-chain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://synapseprotocol.com",
  "shortName": "synapse-sepolia",
  "testnet": true,
  "status": "active",
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "Synapse Chain Sepolia",
      "url": "https://sepolia.synapsescan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;