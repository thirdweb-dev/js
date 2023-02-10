export default {
  "name": "zkSync alpha testnet",
  "chain": "ETH",
  "rpc": [
    "https://zksync2-testnet.zksync.dev"
  ],
  "faucets": [
    "https://portal.zksync.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://v2-docs.zksync.io/",
  "shortName": "zksync-goerli",
  "chainId": 280,
  "networkId": 280,
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zksync2-testnet.zkscan.io",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "zksync-alpha-testnet"
} as const;