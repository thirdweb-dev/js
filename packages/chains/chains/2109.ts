export default {
  "name": "Exosama Network",
  "chain": "EXN",
  "rpc": [
    "https://exosama-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.exosama.com",
    "wss://rpc.exosama.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sama Token",
    "symbol": "SAMA",
    "decimals": 18
  },
  "infoURL": "https://moonsama.com",
  "shortName": "exn",
  "chainId": 2109,
  "networkId": 2109,
  "slip44": 2109,
  "icon": {
    "url": "ipfs://QmaQxfwpXYTomUd24PMx5tKjosupXcm99z1jL1XLq9LWBS",
    "width": 468,
    "height": 468,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.exosama.com",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "exosama-network"
} as const;