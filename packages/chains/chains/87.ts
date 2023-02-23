export default {
  "name": "Nova Network",
  "chain": "NNW",
  "icon": {
    "url": "ipfs://QmTTamJ55YGQwMboq4aqf3JjTEy5WDtjo4GBRQ5VdsWA6U",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://nova-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.novanetwork.io",
    "https://0x57.redjackstudio.com",
    "https://rpc.novanetwork.io:9070"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Supernova",
    "symbol": "SNT",
    "decimals": 18
  },
  "infoURL": "https://novanetwork.io",
  "shortName": "nnw",
  "chainId": 87,
  "networkId": 87,
  "explorers": [
    {
      "name": "novanetwork",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "nova-network"
} as const;