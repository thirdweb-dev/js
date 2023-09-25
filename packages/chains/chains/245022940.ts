import type { Chain } from "../src/types";
export default {
  "chainId": 245022940,
  "chain": "Solana",
  "name": "Neon EVM TestNet",
  "rpc": [
    "https://neon-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.neonevm.org"
  ],
  "slug": "neon-evm-testnet",
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neon-labs.org",
  "shortName": "neonevm-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "native",
      "url": "https://testnet.explorer.neon-labs.org",
      "standard": "EIP3091"
    },
    {
      "name": "neonscan",
      "url": "https://testnet.neonscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;