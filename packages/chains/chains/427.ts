export default {
  "name": "Zeeth Chain",
  "chain": "ZeethChain",
  "rpc": [
    "https://zeeth-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zeeth.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeeth Token",
    "symbol": "ZTH",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "zeeth",
  "chainId": 427,
  "networkId": 427,
  "explorers": [
    {
      "name": "Zeeth Explorer",
      "url": "https://explorer.zeeth.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zeeth-chain"
} as const;