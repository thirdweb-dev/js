export default {
  "name": "BlackFort Exchange Network Testnet",
  "chain": "TBXN",
  "rpc": [
    "https://blackfort-exchange-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.blackfort.network/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BlackFort Testnet Token",
    "symbol": "TBXN",
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
  "shortName": "TBXN",
  "chainId": 4777,
  "networkId": 4777,
  "icon": {
    "url": "ipfs://QmPasA8xykRtJDivB2bcKDiRCUNWDPtfUTTKVAcaF2wVxC",
    "width": 1968,
    "height": 1968,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.blackfort.network",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "blackfort-exchange-network-testnet"
} as const;