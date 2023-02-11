export default {
  "name": "Smart Bitcoin Cash Testnet",
  "chain": "smartBCHTest",
  "rpc": [
    "https://smart-bitcoin-cash-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.smartbch.org",
    "https://smartbch.devops.cash/testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash Test Token",
    "symbol": "BCHT",
    "decimals": 18
  },
  "infoURL": "http://smartbch.org/",
  "shortName": "smartbchtest",
  "chainId": 10001,
  "networkId": 10001,
  "testnet": true,
  "slug": "smart-bitcoin-cash-testnet"
} as const;