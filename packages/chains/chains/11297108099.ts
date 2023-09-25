import type { Chain } from "../src/types";
export default {
  "chainId": 11297108099,
  "chain": "Palm",
  "name": "Palm Testnet",
  "rpc": [
    "https://palm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-testnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "slug": "palm-testnet",
  "icon": {
    "url": "ipfs://bafkreihifvvbq6xzviygveivayogqiotdtpjvilu27bgqobduqemzeq7o4",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "infoURL": "https://palm.io",
  "shortName": "tpalm",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Palm Testnet Explorer",
      "url": "https://explorer.palm-uat.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;