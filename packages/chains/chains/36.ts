export default {
  "name": "Dxchain Mainnet",
  "chain": "Dxchain",
  "icon": {
    "url": "ipfs://QmYBup5bWoBfkaHntbcgW8Ji7ncad7f53deJ4Q55z4PNQs",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "rpc": [
    "https://dxchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.dxchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dxchain",
    "symbol": "DX",
    "decimals": 18
  },
  "infoURL": "https://www.dxchain.com/",
  "shortName": "dx",
  "chainId": 36,
  "networkId": 36,
  "explorers": [
    {
      "name": "dxscan",
      "url": "https://dxscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dxchain"
} as const;