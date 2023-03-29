export default {
  "name": "Jellie",
  "title": "Twala Testnet Jellie",
  "shortName": "twl-jellie",
  "chain": "ETH",
  "chainId": 202624,
  "networkId": 202624,
  "icon": {
    "url": "ipfs://QmTXJVhVKvVC7DQEnGKXvydvwpvVaUEBJrMHvsCr4nr1sK",
    "width": 1326,
    "height": 1265,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "Twala Coin",
    "symbol": "TWL",
    "decimals": 18
  },
  "rpc": [
    "https://jellie.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jellie-rpc.twala.io/",
    "wss://jellie-rpc-wss.twala.io/"
  ],
  "faucets": [],
  "infoURL": "https://twala.io/",
  "explorers": [
    {
      "name": "Jellie Blockchain Explorer",
      "url": "https://jellie.twala.io",
      "standard": "EIP3091",
      "icon": "twala"
    }
  ],
  "testnet": true,
  "slug": "jellie"
} as const;