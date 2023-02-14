export default {
  "name": "Tres Mainnet",
  "chain": "TresLeches",
  "rpc": [
    "https://tres.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tresleches.finance/",
    "https://rpc.treschain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "infoURL": "https://treschain.com",
  "shortName": "TRESMAIN",
  "chainId": 6066,
  "networkId": 6066,
  "icon": {
    "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer.tresleches.finance",
      "icon": "treslechesexplorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "tres"
} as const;