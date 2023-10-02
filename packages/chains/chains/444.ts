import type { Chain } from "../src/types";
export default {
  "name": "Synapse Chain Testnet",
  "status": "active",
  "chain": "ETH",
  "rpc": [
    "https://synapse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.synapseprotocol.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://synapseprotocol.com",
  "shortName": "synapse-sepolia",
  "chainId": 444,
  "networkId": 444,
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
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://docs.synapseprotocol.com/synapse-chain/using-synapse-chain/bridging-to-synapse-chain"
      }
    ]
  },
  "icon": {
    "url": "ipfs://QmX2Z71QszaZvpMppdNWeCLqmeWk8NA6KMDLMqAt5VRyVi/synapse.webp",
    "height": 720,
    "width": 720,
    "format": "webp"
  },
  "testnet": true,
  "slug": "synapse-chain-testnet"
} as const satisfies Chain;