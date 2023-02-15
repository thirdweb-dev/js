export default {
  "name": "Zhejiang",
  "chain": "ETH",
  "rpc": [
    "https://zhejiang.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zhejiang.ethpandaops.io"
  ],
  "faucets": [
    "https://faucet.zhejiang.ethpandaops.io",
    "https://zhejiang-faucet.pk910.de"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zhejiang.ethpandaops.io",
  "shortName": "zhejiang",
  "chainId": 1337803,
  "networkId": 1337803,
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Zhejiang Explorer",
      "url": "https://zhejiang.beaconcha.in",
      "icon": "ethereum",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "zhejiang"
} as const;