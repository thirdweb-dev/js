export default {
  "name": "OKExChain Testnet",
  "chain": "okexchain",
  "rpc": [
    "https://okexchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://exchaintestrpc.okex.org"
  ],
  "faucets": [
    "https://www.okex.com/drawdex"
  ],
  "nativeCurrency": {
    "name": "OKExChain Global Utility Token in testnet",
    "symbol": "OKT",
    "decimals": 18
  },
  "infoURL": "https://www.okex.com/okexchain",
  "shortName": "tokt",
  "chainId": 65,
  "networkId": 65,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okexchain-test",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "okexchain-testnet"
} as const;