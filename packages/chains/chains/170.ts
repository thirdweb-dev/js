export default {
  "name": "HOO Smart Chain Testnet",
  "chain": "ETH",
  "rpc": [
    "https://hoo-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.hoosmartchain.com"
  ],
  "faucets": [
    "https://faucet-testnet.hscscan.com/"
  ],
  "nativeCurrency": {
    "name": "HOO",
    "symbol": "HOO",
    "decimals": 18
  },
  "infoURL": "https://www.hoosmartchain.com",
  "shortName": "hoosmartchain",
  "chainId": 170,
  "networkId": 170,
  "testnet": true,
  "slug": "hoo-smart-chain-testnet"
} as const;