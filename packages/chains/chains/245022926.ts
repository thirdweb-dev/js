import type { Chain } from "../src/types";
export default {
  "chainId": 245022926,
  "chain": "Solana",
  "name": "Neon EVM DevNet",
  "rpc": [
    "https://neon-evm-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.neonevm.org"
  ],
  "slug": "neon-evm-devnet",
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://neonfaucet.org"
  ],
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neon-labs.org",
  "shortName": "neonevm-devnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "native",
      "url": "https://devnet.explorer.neon-labs.org",
      "standard": "EIP3091"
    },
    {
      "name": "neonscan",
      "url": "https://devnet.neonscan.org",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://neon-devnet.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;