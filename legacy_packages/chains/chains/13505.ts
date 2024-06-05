import type { Chain } from "../src/types";
export default {
  "chain": "Gravity",
  "chainId": 13505,
  "explorers": [
    {
      "name": "Gravity Alpha Testnet Sepolia Explorer",
      "url": "https://explorer-sepolia.gravity.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    },
    {
      "name": "EIP1108"
    }
  ],
  "icon": {
    "url": "ipfs://QmU5XU4S5oaGM5fj8oU1ovhWoXCzGWspwRj2zWRTuJrU4k",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://gravity.xyz",
  "name": "Gravity Alpha Testnet Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Gravity",
    "symbol": "G.",
    "decimals": 18
  },
  "networkId": 13505,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [
    "https://13505.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sepolia.gravity.xyz"
  ],
  "shortName": "gravitysep",
  "slug": "gravity-alpha-testnet-sepolia",
  "testnet": true
} as const satisfies Chain;