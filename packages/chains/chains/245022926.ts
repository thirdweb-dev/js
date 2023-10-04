import type { Chain } from "../src/types";
export default {
  "chain": "Solana",
  "chainId": 245022926,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://neon-devnet.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "native",
      "url": "https://devnet.explorer.neon-labs.org",
      "standard": "EIP3091"
    },
    {
      "name": "neonscan",
      "url": "https://devnet.neonscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://neonfaucet.org"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://neon-labs.org",
  "name": "Neon EVM DevNet",
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://neon-evm-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.neonevm.org"
  ],
  "shortName": "neonevm-devnet",
  "slug": "neon-evm-devnet",
  "testnet": false
} as const satisfies Chain;