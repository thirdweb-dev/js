import type { Chain } from "../types";
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
  "networkId": 444,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://docs.synapseprotocol.com/synapse-chain/using-synapse-chain/bridging-to-synapse-chain"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://synapse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.synapseprotocol.com"
  ],
  "shortName": "synapse-sepolia",
  "slug": "synapse-chain-testnet",
  "status": "active",
  "testnet": false
} as const satisfies Chain;