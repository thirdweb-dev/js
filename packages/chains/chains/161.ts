export default {
  "name": "Armonia Eva Chain Testnet",
  "chain": "Wall-e",
  "rpc": [
    "https://armonia-eva-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.evascan.io/api/eth-rpc/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amax.network",
  "shortName": "wall-e",
  "chainId": 161,
  "networkId": 161,
  "explorers": [
    {
      "name": "blockscout - evascan",
      "url": "https://testnet.evascan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "armonia-eva-chain-testnet"
} as const;