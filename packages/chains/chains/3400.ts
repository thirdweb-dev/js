export default {
  "name": "Paribu Net Mainnet",
  "chain": "PRB",
  "rpc": [
    "https://paribu-net.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.paribu.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "infoURL": "https://net.paribu.com",
  "shortName": "prb",
  "chainId": 3400,
  "networkId": 3400,
  "icon": {
    "url": "ipfs://QmVgc77jYo2zrxQjhYwT4KzvSrSZ1DBJraJVX57xAvP8MD",
    "width": 2362,
    "height": 2362,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Paribu Net Explorer",
      "url": "https://explorer.paribu.network",
      "icon": "explorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "paribu-net"
} as const;