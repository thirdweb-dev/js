export default {
  "name": "Decimal Smart Chain Mainnet",
  "chain": "DSC",
  "rpc": [
    "https://decimal-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.decimalchain.com/web3"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "DEL",
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
  "infoURL": "https://decimalchain.com",
  "shortName": "DSC",
  "chainId": 75,
  "networkId": 75,
  "icon": {
    "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "DSC Explorer Mainnet",
      "url": "https://explorer.decimalchain.com",
      "icon": "dsc",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "decimal-smart-chain"
} as const;