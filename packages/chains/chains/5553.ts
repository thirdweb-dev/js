export default {
  "name": "Nahmii Testnet",
  "chain": "Nahmii",
  "rpc": [
    "https://nahmii-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2.testnet.nahmii.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "shortName": "NahmiiTestnet",
  "chainId": 5553,
  "networkId": 5553,
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.testnet.nahmii.io",
      "icon": "nahmii",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-3",
    "bridges": [
      {
        "url": "https://bridge.nahmii.io"
      }
    ]
  },
  "testnet": true,
  "slug": "nahmii-testnet"
} as const;