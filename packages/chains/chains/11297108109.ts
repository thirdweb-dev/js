import type { Chain } from "../src/types";
export default {
  "chain": "Palm",
  "chainId": 11297108109,
  "explorers": [
    {
      "name": "Chainlens",
      "url": "https://palm.chainlens.com",
      "standard": "EIP3091"
    },
    {
      "name": "Dora",
      "url": "https://www.ondora.xyz/network/palm",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreihifvvbq6xzviygveivayogqiotdtpjvilu27bgqobduqemzeq7o4",
    "width": 72,
    "height": 72,
    "format": "svg"
  },
  "infoURL": "https://palm.network",
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
    "https://palm-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://palm-mainnet.public.blastapi.io"
  ],
  "shortName": "palm",
  "slug": "palm",
  "testnet": false
} as const satisfies Chain;