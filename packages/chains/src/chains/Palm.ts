import type { Chain } from "../types";
export default {
  "chain": "Palm",
  "chainId": 11297108109,
  "explorers": [
    {
      "name": "Palm Explorer",
      "url": "https://explorer.palm.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreihifvvbq6xzviygveivayogqiotdtpjvilu27bgqobduqemzeq7o4",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "infoURL": "https://palm.io",
  "name": "Palm",
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "networkId": 11297108109,
  "rpc": [
    "https://palm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://11297108109.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "shortName": "palm",
  "slug": "palm",
  "testnet": false
} as const satisfies Chain;