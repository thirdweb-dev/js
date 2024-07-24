import type { Chain } from "../src/types";
export default {
  "chain": "Camp Network Testnet V2",
  "chainId": 325000,
  "explorers": [
    {
      "name": "Camp Network Testnet explorer",
      "url": "https://camp-network-testnet.blockscout.com",
      "standard": "EIP1559",
      "icon": {
        "url": "ipfs://Qmd5ux27W44fjxHP2opz7eLhJ6CJJm9WR6VcKNhbQBxiSd/QOyzwbO2_400x400.jpg",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmd5ux27W44fjxHP2opz7eLhJ6CJJm9WR6VcKNhbQBxiSd/QOyzwbO2_400x400.jpg",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://docs.campnetwork.xyz/",
  "name": "Camp Network Testnet V2",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 325000,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/camp-network-testnet"
      },
      {
        "url": "https://bridge.gelato.network/bridge/camp-network-testnet"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://325000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.camp-network-testnet.gelato.digital"
  ],
  "shortName": "Camp Testnet v2",
  "slug": "camp-network-testnet-v2",
  "testnet": true
} as const satisfies Chain;