export default {
  "name": "BlackFort Exchange Network",
  "chain": "BXN",
  "rpc": [
    "https://blackfort-exchange-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blackfort.network/rpc",
    "https://mainnet-1.blackfort.network/rpc",
    "https://mainnet-2.blackfort.network/rpc",
    "https://mainnet-3.blackfort.network/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BlackFort Token",
    "symbol": "BXN",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://blackfort.exchange",
  "shortName": "BXN",
  "chainId": 4999,
  "networkId": 4999,
  "icon": {
    "url": "ipfs://QmPasA8xykRtJDivB2bcKDiRCUNWDPtfUTTKVAcaF2wVxC",
    "width": 1968,
    "height": 1968,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.blackfort.network",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "blackfort-exchange-network"
} as const;