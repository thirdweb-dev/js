import type { Chain } from "../src/types";
export default {
  "chain": "DODOchain",
  "chainId": 53457,
  "explorers": [
    {
      "name": "DODOchain Testnet (Sepolia) Explorer",
      "url": "https://testnet-scan.dodochain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQDdZQjpKhrVM62479RTzppUG8QHhHd8Bq4RFYAjN1yf4",
        "width": 160,
        "height": 160,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQDdZQjpKhrVM62479RTzppUG8QHhHd8Bq4RFYAjN1yf4",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "infoURL": "https://www.dodochain.com",
  "name": "DODOchain testnet",
  "nativeCurrency": {
    "name": "DODO",
    "symbol": "DODO",
    "decimals": 18
  },
  "networkId": 53457,
  "rpc": [
    "https://53457.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dodochain-testnet.alt.technology",
    "wss://dodochain-testnet.alt.technology/ws"
  ],
  "shortName": "dodochain",
  "slug": "dodochain-testnet",
  "testnet": true,
  "title": "DODOchain testnet"
} as const satisfies Chain;