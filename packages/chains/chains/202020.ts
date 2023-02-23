export default {
  "name": "Decimal Smart Chain Testnet",
  "chain": "tDSC",
  "rpc": [
    "https://decimal-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-val.decimalchain.com/web3"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "tDEL",
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
  "shortName": "tDSC",
  "chainId": 202020,
  "networkId": 202020,
  "icon": {
    "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "explorers": [
    {
      "name": "DSC Explorer Testnet",
      "url": "https://testnet.explorer.decimalchain.com",
      "icon": "dsc",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "decimal-smart-chain-testnet"
} as const;