export default {
  "name": "QEasyWeb3 Testnet",
  "chain": "QET",
  "rpc": [
    "https://qeasyweb3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://qeasyweb3.com"
  ],
  "faucets": [
    "http://faucet.qeasyweb3.com"
  ],
  "nativeCurrency": {
    "name": "QET",
    "symbol": "QET",
    "decimals": 18
  },
  "infoURL": "https://www.qeasyweb3.com",
  "shortName": "QETTest",
  "chainId": 9528,
  "networkId": 9528,
  "explorers": [
    {
      "name": "QEasyWeb3 Explorer",
      "url": "https://www.qeasyweb3.com",
      "icon": "qetscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "qeasyweb3-testnet"
} as const;