export default {
  "name": "Ethereum Classic Mainnet",
  "chain": "ETC",
  "rpc": [
    "https://ethereum-classic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.ethercluster.com/etc"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/?"
  ],
  "nativeCurrency": {
    "name": "Ethereum Classic Ether",
    "symbol": "ETC",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org",
  "shortName": "etc",
  "chainId": 61,
  "networkId": 1,
  "slip44": 61,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/etc/mainnet",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "ethereum-classic"
} as const;