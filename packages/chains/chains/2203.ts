export default {
  "name": "Bitcoin EVM",
  "chain": "Bitcoin EVM",
  "rpc": [
    "https://bitcoin-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bitcoinevm.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "eBTC",
    "decimals": 18
  },
  "infoURL": "https://bitcoinevm.com",
  "shortName": "eBTC",
  "chainId": 2203,
  "networkId": 2203,
  "icon": {
    "url": "ipfs://bafkreic4aq265oaf6yze7ba5okefqh6vnqudyrz6ovukvbnrlhet36itle",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.bitcoinevm.com",
      "icon": "ebtc",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bitcoin-evm"
} as const;