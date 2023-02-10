export default {
  "name": "zkSync v2",
  "chain": "ETH",
  "rpc": [],
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
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "explorers": [
    {
      "name": "zkSync v2 Block Explorer",
      "url": "https://explorer.zksync.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": []
  },
  "status": "incubating",
  "testnet": false,
  "slug": "zksync-v2"
} as const;