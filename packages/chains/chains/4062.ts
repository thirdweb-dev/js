export default {
  "name": "Nahmii 3 Testnet",
  "chain": "Nahmii",
  "rpc": [
    "https://nahmii-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ngeth.testnet.n3.nahmii.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "shortName": "Nahmii3Testnet",
  "chainId": 4062,
  "networkId": 4062,
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Nahmii 3 Testnet Explorer",
      "url": "https://explorer.testnet.n3.nahmii.io",
      "icon": "nahmii",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-3",
    "bridges": [
      {
        "url": "https://bridge.testnet.n3.nahmii.io"
      }
    ]
  },
  "testnet": true,
  "slug": "nahmii-3-testnet"
} as const;