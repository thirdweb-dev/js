export default {
  "name": "Soverun Testnet",
  "chain": "SVRN",
  "icon": {
    "url": "ipfs://QmTYazUzgY9Nn2mCjWwFUSLy3dG6i2PvALpwCNQvx1zXyi",
    "width": 1154,
    "height": 1154,
    "format": "png"
  },
  "rpc": [
    "https://soverun-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.soverun.com"
  ],
  "faucets": [
    "https://faucet.soverun.com"
  ],
  "nativeCurrency": {
    "name": "Soverun",
    "symbol": "SVRN",
    "decimals": 18
  },
  "infoURL": "https://soverun.com",
  "shortName": "SVRNt",
  "chainId": 101010,
  "networkId": 101010,
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://testnet.soverun.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "soverun-testnet"
} as const;