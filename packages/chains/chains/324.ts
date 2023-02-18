export default {
  "name": "zkSync Era Mainnet",
  "chain": "ETH",
  "rpc": [
    "https://zksync-era.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zksync2-mainnet.zksync.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zksync.io/",
  "shortName": "zksync",
  "chainId": 324,
  "networkId": 324,
  "icon": {
    "url": "ipfs://Qma6H9xd8Ydah1bAFnmDuau1jeMh5NjGEL8tpdnjLbJ7m2",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://explorer.zksync.io",
      "icon": "zksync-era",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://portal.zksync.io/bridge"
      }
    ]
  },
  "testnet": false,
  "slug": "zksync-era"
} as const;