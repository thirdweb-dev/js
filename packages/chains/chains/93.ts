export default {
  "name": "Garizon Stage3",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-stage3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s3.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-s3",
  "chainId": 93,
  "networkId": 93,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "icon": "garizon",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "chain": "eip155-90",
    "type": "shard"
  },
  "testnet": false,
  "slug": "garizon-stage3"
} as const;