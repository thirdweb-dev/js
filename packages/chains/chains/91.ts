export default {
  "name": "Garizon Stage1",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-stage1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s1.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-s1",
  "chainId": 91,
  "networkId": 91,
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
  "slug": "garizon-stage1"
} as const;