export default {
  "name": "TOP Mainnet EVM",
  "chain": "TOP",
  "icon": {
    "url": "ipfs://QmYikaM849eZrL8pGNeVhEHVTKWpxdGMvCY5oFBfZ2ndhd",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://top-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethapi.topnetwork.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.topnetwork.org/",
  "shortName": "top_evm",
  "chainId": 980,
  "networkId": 0,
  "explorers": [
    {
      "name": "topscan.dev",
      "url": "https://www.topscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "top-evm"
} as const;