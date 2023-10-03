import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 444,
  "explorers": [
    {
      "name": "Synapse Chain Sepolia",
      "url": "https://sepolia.synapsescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmX2Z71QszaZvpMppdNWeCLqmeWk8NA6KMDLMqAt5VRyVi/synapse.webp",
    "width": 720,
    "height": 720,
    "format": "webp"
  },
  "infoURL": "https://synapseprotocol.com",
  "name": "Synapse Chain Testnet",
  "nativeCurrency": {
    "name": "Sepolia ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://synapse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.synapseprotocol.com"
  ],
  "shortName": "synapse-sepolia",
  "slug": "synapse-chain-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;