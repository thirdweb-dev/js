export default {
  "name": "Imversed Mainnet",
  "chain": "Imversed",
  "rpc": [
    "https://imversed.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.imversed.network",
    "https://ws-jsonrpc.imversed.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Imversed Token",
    "symbol": "IMV",
    "decimals": 18
  },
  "infoURL": "https://imversed.com",
  "shortName": "imversed",
  "chainId": 5555555,
  "networkId": 5555555,
  "icon": {
    "url": "ipfs://QmYwvmJZ1bgTdiZUKXk4SifTpTj286CkZjMCshUyJuBFH1",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Imversed EVM explorer (Blockscout)",
      "url": "https://txe.imversed.network",
      "icon": "imversed",
      "standard": "EIP3091"
    },
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-c.imversed.com",
      "icon": "imversed",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "imversed"
} as const;