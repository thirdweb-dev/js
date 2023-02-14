export default {
  "name": "Garizon Testnet Stage0",
  "chain": "GAR",
  "icon": {
    "url": "ipfs://QmW3WRyuLZ95K8hvV2QN6rP5yWY98sSzWyVUxD2eUjXGrc",
    "width": 1024,
    "height": 613,
    "format": "png"
  },
  "rpc": [
    "https://garizon-testnet-stage0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s0-testnet.garizon.net/rpc"
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
  "shortName": "gar-test-s0",
  "chainId": 900,
  "networkId": 900,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "icon": "garizon",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "garizon-testnet-stage0"
} as const;