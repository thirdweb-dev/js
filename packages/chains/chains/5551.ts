export default {
  "name": "Nahmii Mainnet",
  "chain": "Nahmii",
  "rpc": [
    "https://nahmii.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2.nahmii.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "shortName": "Nahmii",
  "chainId": 5551,
  "networkId": 5551,
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Nahmii mainnet explorer",
      "url": "https://explorer.nahmii.io",
      "icon": "nahmii",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.nahmii.io"
      }
    ]
  },
  "testnet": false,
  "slug": "nahmii"
} as const;