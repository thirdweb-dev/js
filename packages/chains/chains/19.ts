export default {
  "name": "Songbird Canary-Network",
  "chain": "SGB",
  "icon": {
    "url": "ipfs://QmXyvnrZY8FUxSULfnKKA99sAEkjAHtvhRx5WeHixgaEdu",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "rpc": [
    "https://songbird-canary-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://songbird-api.flare.network/ext/C/rpc",
    "https://sgb.ftso.com.au/ext/bc/C/rpc",
    "https://sgb.lightft.so/rpc",
    "https://sgb-rpc.ftso.eu"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Songbird",
    "symbol": "SGB",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "shortName": "sgb",
  "chainId": 19,
  "networkId": 19,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://songbird-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "songbird-canary-network"
} as const;