export default {
  "name": "Neon EVM MainNet",
  "chain": "Solana",
  "rpc": [
    "https://neon-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.neonevm.org"
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmcxevb3v8PEvnvfYgcG3bCBuPhe5YAdsHeaufDChSSR3Q",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neon-labs.org",
  "shortName": "neonevm-mainnet",
  "chainId": 245022934,
  "networkId": 245022934,
  "explorers": [
    {
      "name": "native",
      "url": "https://mainnet.explorer.neon-labs.org",
      "standard": "EIP3091"
    },
    {
      "name": "neonscan",
      "url": "https://mainnet.neonscan.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "neon-evm"
} as const;