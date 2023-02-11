export default {
  "name": "Hertz Network Mainnet",
  "chain": "HTZ",
  "rpc": [
    "https://hertz-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.hertzscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hertz",
    "symbol": "HTZ",
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
  "infoURL": "https://www.hertz-network.com",
  "shortName": "HTZ",
  "chainId": 26600,
  "networkId": 26600,
  "icon": {
    "url": "ipfs://Qmf3GYbPXmTDpSP6t7Ug2j5HjEwrY5oGhBDP7d4TQHvGnG",
    "width": 162,
    "height": 129,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Hertz Scan",
      "url": "https://hertzscan.com",
      "icon": "hertz-network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "hertz-network"
} as const;