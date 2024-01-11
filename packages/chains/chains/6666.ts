import type { Chain } from "../src/types";
export default {
  "chain": "CYBA",
  "chainId": 6666,
  "explorers": [
    {
      "name": "Cybria Explorer",
      "url": "https://explorer.cybascan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiagdqfrvnbdjhkh27gjbvepzo66dpqgnbffmpnywuw5ncprg3jk3u",
        "width": 2264,
        "height": 408,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.cybascan.io"
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
    "url": "ipfs://bafkreiarso74bytq5ccnl3mlfhd4ejiylwautsr6ovbqgmynzjzmkorn6y",
    "width": 500,
    "height": 500,
    "format": "svg"
  },
  "infoURL": "https://cybria.io",
  "name": "Cybria Testnet",
  "nativeCurrency": {
    "name": "Cybria",
    "symbol": "CYBA",
    "decimals": 18
  },
  "networkId": 6666,
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
    "https://cybria-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-rpc.cybascan.io"
  ],
  "shortName": "tcyba",
  "slug": "cybria-testnet",
  "testnet": true
} as const satisfies Chain;