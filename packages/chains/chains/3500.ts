export default {
  "name": "Paribu Net Testnet",
  "chain": "PRB",
  "rpc": [
    "https://paribu-net-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.paribuscan.com"
  ],
  "faucets": [
    "https://faucet.paribuscan.com"
  ],
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "infoURL": "https://net.paribu.com",
  "shortName": "prbtestnet",
  "chainId": 3500,
  "networkId": 3500,
  "icon": {
    "url": "ipfs://QmVgc77jYo2zrxQjhYwT4KzvSrSZ1DBJraJVX57xAvP8MD",
    "width": 2362,
    "height": 2362,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Paribu Net Testnet Explorer",
      "url": "https://testnet.paribuscan.com",
      "icon": "explorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "paribu-net-testnet"
} as const;