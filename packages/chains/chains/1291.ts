import type { Chain } from "../src/types";
export default {
  "chainId": 1291,
  "chain": "SWTR",
  "name": "Swisstronik Testnet",
  "rpc": [
    "https://swisstronik-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.testnet.swisstronik.com"
  ],
  "slug": "swisstronik-testnet",
  "icon": {
    "url": "ipfs://bafybeihuintkoipxalwans23vhxajbwjnozpy34ww7ia7ds7nay3rpylzi",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.testnet.swisstronik.com"
  ],
  "nativeCurrency": {
    "name": "Swisstronik",
    "symbol": "SWTR",
    "decimals": 18
  },
  "infoURL": "https://www.swisstronik.com",
  "shortName": "swtr",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Swisstronik Scout",
      "url": "https://explorer-evm.testnet.swisstronik.com",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;