import type { Chain } from "../src/types";
export default {
  "chainId": 11297108109,
  "chain": "Palm",
  "name": "Palm",
  "rpc": [
    "https://palm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}"
  ],
  "slug": "palm",
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
  "shortName": "palm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Palm Explorer",
      "url": "https://explorer.palm.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;