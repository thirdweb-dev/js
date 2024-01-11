import type { Chain } from "../src/types";
export default {
  "chain": "CYBA",
  "chainId": 6661,
  "explorers": [
    {
      "name": "Cybria Explorer",
      "url": "https://cybascan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiagdqfrvnbdjhkh27gjbvepzo66dpqgnbffmpnywuw5ncprg3jk3u",
        "width": 2264,
        "height": 408,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreiarso74bytq5ccnl3mlfhd4ejiylwautsr6ovbqgmynzjzmkorn6y",
    "width": 500,
    "height": 500,
    "format": "svg"
  },
  "infoURL": "https://cybria.io",
  "name": "Cybria Mainnet",
  "nativeCurrency": {
    "name": "Cybria",
    "symbol": "CYBA",
    "decimals": 18
  },
  "networkId": 6661,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155420",
    "bridges": [
      {
        "url": "https://app.optimism.io/bridge"
      }
    ]
  },
  "rpc": [
    "https://cybria.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6661.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.cybria.io"
  ],
  "shortName": "cyba",
  "slug": "cybria",
  "testnet": false
} as const satisfies Chain;