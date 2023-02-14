export default {
  "name": "Kekchain (kektest)",
  "chain": "kek",
  "rpc": [
    "https://kekchain-kektest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.kekchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tKEK",
    "symbol": "tKEK",
    "decimals": 18
  },
  "infoURL": "https://kekchain.com",
  "shortName": "tKEK",
  "chainId": 420666,
  "networkId": 1,
  "icon": {
    "url": "ipfs://QmNzwHAmaaQyuvKudrzGkrTT2GMshcmCmJ9FH8gG2mNJtM",
    "width": 401,
    "height": 401,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.kekchain.com",
      "icon": "kek",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kekchain-kektest"
} as const;