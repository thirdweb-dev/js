export default {
  "name": "Garizon Testnet Stage1",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-testnet-stage1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s1-testnet.garizon.net/rpc"
  ],
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-test-s1",
  "chainId": 901,
  "networkId": 901,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "icon": "garizon",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "chain": "eip155-900",
    "type": "shard"
  },
  "testnet": true,
  "slug": "garizon-testnet-stage1"
} as const;