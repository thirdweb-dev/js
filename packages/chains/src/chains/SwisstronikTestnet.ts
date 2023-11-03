import type { Chain } from "../types";
export default {
  "chain": "SWTR",
  "chainId": 1291,
  "explorers": [
    {
      "name": "Swisstronik Scout",
      "url": "https://explorer-evm.testnet.swisstronik.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.testnet.swisstronik.com"
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
    "url": "ipfs://bafybeihuintkoipxalwans23vhxajbwjnozpy34ww7ia7ds7nay3rpylzi",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://www.swisstronik.com",
  "name": "Swisstronik Testnet",
  "nativeCurrency": {
    "name": "Swisstronik",
    "symbol": "SWTR",
    "decimals": 18
  },
  "networkId": 1291,
  "rpc": [
    "https://swisstronik-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1291.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.testnet.swisstronik.com"
  ],
  "shortName": "swtr",
  "slug": "swisstronik-testnet",
  "testnet": true
} as const satisfies Chain;