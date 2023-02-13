export default {
  "name": "OasisChain Mainnet",
  "chain": "OasisChain",
  "rpc": [
    "https://oasischain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.oasischain.io",
    "https://rpc2.oasischain.io",
    "https://rpc3.oasischain.io"
  ],
  "faucets": [
    "http://faucet.oasischain.io"
  ],
  "nativeCurrency": {
    "name": "OAC",
    "symbol": "OAC",
    "decimals": 18
  },
  "infoURL": "https://scan.oasischain.io",
  "shortName": "OAC",
  "chainId": 26863,
  "networkId": 26863,
  "explorers": [
    {
      "name": "OasisChain Explorer",
      "url": "https://scan.oasischain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "oasischain"
} as const;