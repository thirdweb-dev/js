export default {
  "name": "Soverun Mainnet",
  "chain": "SVRN",
  "icon": {
    "url": "ipfs://QmTYazUzgY9Nn2mCjWwFUSLy3dG6i2PvALpwCNQvx1zXyi",
    "width": 1154,
    "height": 1154,
    "format": "png"
  },
  "rpc": [
    "https://soverun.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.soverun.com"
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
  "shortName": "SVRNm",
  "chainId": 10101010,
  "networkId": 10101010,
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://explorer.soverun.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "soverun"
} as const;