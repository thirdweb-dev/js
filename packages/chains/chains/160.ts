export default {
  "name": "Armonia Eva Chain Mainnet",
  "chain": "Eva",
  "rpc": [
    "https://armonia-eva-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evascan.io/api/eth-rpc/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amax.network",
  "shortName": "eva",
  "chainId": 160,
  "networkId": 160,
  "status": "incubating",
  "testnet": false,
  "slug": "armonia-eva-chain"
} as const;