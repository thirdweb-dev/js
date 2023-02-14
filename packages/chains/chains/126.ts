export default {
  "name": "OYchain Mainnet",
  "chain": "OYchain",
  "icon": {
    "url": "ipfs://QmXW5T2MaGHznXUmQEXoyJjcdmX7dhLbj5fnqvZZKqeKzA",
    "width": 677,
    "height": 237,
    "format": "png"
  },
  "rpc": [
    "https://oychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oychain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OYchain Token",
    "symbol": "OY",
    "decimals": 18
  },
  "infoURL": "https://www.oychain.io",
  "shortName": "OYchainMainnet",
  "chainId": 126,
  "networkId": 126,
  "slip44": 126,
  "explorers": [
    {
      "name": "OYchain Mainnet Explorer",
      "url": "https://explorer.oychain.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "oychain"
} as const;