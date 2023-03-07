export default {
  "name": "Nahmii 3 Mainnet",
  "chain": "Nahmii",
  "rpc": [],
  "status": "incubating",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "shortName": "Nahmii3Mainnet",
  "chainId": 4061,
  "networkId": 4061,
  "icon": {
    "url": "ipfs://QmZhKXgoGpzvthr2eh8ZNgT75YvMtEBegdELAaMPPzf5QT",
    "width": 384,
    "height": 384,
    "format": "png"
  },
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
  "slug": "nahmii-3"
} as const;