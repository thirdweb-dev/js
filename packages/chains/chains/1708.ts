export default {
  "name": "TBSI Testnet",
  "title": "Thai Blockchain Service Infrastructure Testnet",
  "chain": "TBSI",
  "rpc": [
    "https://tbsi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.blockchain.or.th"
  ],
  "faucets": [
    "https://faucet.blockchain.or.th"
  ],
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "infoURL": "https://blockchain.or.th",
  "shortName": "tTBSI",
  "chainId": 1708,
  "networkId": 1708,
  "testnet": true,
  "slug": "tbsi-testnet"
} as const;