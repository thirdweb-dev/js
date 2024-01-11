import type { Chain } from "../src/types";
export default {
  "chain": "Palm",
  "chainId": 11297108099,
  "explorers": [
    {
      "name": "Palm Testnet Explorer",
      "url": "https://explorer.palm-uat.xyz",
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
  "name": "Palm Testnet",
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "networkId": 11297108099,
  "rpc": [
    "https://palm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://11297108099.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-testnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "shortName": "tpalm",
  "slip44": 1,
  "slug": "palm-testnet",
  "testnet": true
} as const satisfies Chain;