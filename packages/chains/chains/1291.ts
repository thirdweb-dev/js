import type { Chain } from "../src/types";
export default {
  "name": "Swisstronik Testnet",
  "chain": "SWTR",
  "rpc": [
    "https://swisstronik-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.testnet.swisstronik.com"
  ],
  "faucets": [
    "https://faucet.testnet.swisstronik.com"
  ],
  "nativeCurrency": {
    "name": "Swisstronik",
    "symbol": "SWTR",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.swisstronik.com",
  "shortName": "swtr",
  "chainId": 1291,
  "networkId": 1291,
  "icon": {
    "url": "ipfs://bafybeihuintkoipxalwans23vhxajbwjnozpy34ww7ia7ds7nay3rpylzi",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Swisstronik Scout",
      "url": "https://explorer-evm.testnet.swisstronik.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "swisstronik-testnet"
} as const satisfies Chain;