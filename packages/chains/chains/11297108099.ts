import type { Chain } from "../src/types";
export default {
  "chain": "Palm",
  "chainId": 11297108099,
  "explorers": [
    {
      "name": "Chainlens",
      "url": "https://testnet.palm.chainlens.com",
      "standard": "EIP3091"
    },
    {
      "name": "Dora",
      "url": "https://www.ondora.xyz/network/palm-testnet",
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
  "name": "Palm Testnet",
  "nativeCurrency": {
    "name": "PALM",
    "symbol": "PALM",
    "decimals": 18
  },
  "networkId": 11297108099,
  "rpc": [
    "https://11297108099.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palm-testnet.infura.io/v3/${INFURA_API_KEY}",
    "https://palm-testnet.public.blastapi.io"
  ],
  "shortName": "tpalm",
  "slip44": 1,
  "slug": "palm-testnet",
  "testnet": true
} as const satisfies Chain;