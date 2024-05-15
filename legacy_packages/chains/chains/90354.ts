import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 90354,
  "explorers": [
    {
      "name": "Block Explorer",
      "url": "https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmd5ux27W44fjxHP2opz7eLhJ6CJJm9WR6VcKNhbQBxiSd/QOyzwbO2_400x400.jpg",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [
    "https://www.campnetwork.xyz/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qmd5ux27W44fjxHP2opz7eLhJ6CJJm9WR6VcKNhbQBxiSd/QOyzwbO2_400x400.jpg",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://campaign-1.gitbook.io/camp-technical-docså",
  "name": "Camp Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 90354,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://camp-testnet-bridge.vercel.app/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://90354.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-camp-network-4xje7wy105.t.conduit.xyz/",
    "https://rpc-camp-network-4xje7wy105.t.conduit.xyz"
  ],
  "shortName": "campaign-l2",
  "slip44": 1,
  "slug": "camp-network",
  "testnet": false
} as const satisfies Chain;