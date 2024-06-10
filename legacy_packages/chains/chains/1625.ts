import type { Chain } from "../src/types";
export default {
  "chain": "Gravity",
  "chainId": 1625,
  "explorers": [
    {
      "name": "Gravity Alpha Mainnet Explorer",
      "url": "https://explorer.gravity.xyz",
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
  "name": "Gravity Alpha Mainnet",
  "nativeCurrency": {
    "name": "Gravity",
    "symbol": "G.",
    "decimals": 18
  },
  "networkId": 1625,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gravity.xyz"
      }
    ]
  },
  "rpc": [
    "https://1625.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gravity.xyz"
  ],
  "shortName": "gravity",
  "slug": "gravity-alpha",
  "testnet": false
} as const satisfies Chain;