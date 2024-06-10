import type { Chain } from "../src/types";
export default {
  "chain": "Superseed Sepolia Testnet",
  "chainId": 53302,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://sepolia-explorer.superseed.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmSyw4AhwGALxb17qWLZgzpHJksqdqNvWuNrhuoMPfb61C",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://sepoliafaucet.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmSyw4AhwGALxb17qWLZgzpHJksqdqNvWuNrhuoMPfb61C",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://www.superseed.xyz",
  "name": "Superseed Sepolia Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 53302,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://sepolia-bridge.superseed.xyz/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://53302.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.superseed.xyz",
    "wss://sepolia.superseed.xyz"
  ],
  "shortName": "superseed-sepolia-testnet",
  "slip44": 1,
  "slug": "superseed-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;