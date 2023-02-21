export default {
  "name": "XODEX",
  "chain": "XODEX",
  "rpc": [
    "https://xodex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.xo-dex.com/rpc",
    "https://xo-dex.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XODEX Native Token",
    "symbol": "XODEX",
    "decimals": 18
  },
  "infoURL": "https://xo-dex.com",
  "shortName": "xodex",
  "chainId": 2415,
  "networkId": 10,
  "icon": {
    "url": "ipfs://QmXt49jPfHUmDF4n8TF7ks6txiPztx6qUHanWmHnCoEAhW",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "XODEX Explorer",
      "url": "https://explorer.xo-dex.com",
      "standard": "EIP3091",
      "icon": "xodex"
    }
  ],
  "testnet": false,
  "slug": "xodex"
} as const;