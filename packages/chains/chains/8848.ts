export default {
  "name": "MARO Blockchain Mainnet",
  "chain": "MARO Blockchain",
  "icon": {
    "url": "ipfs://bafkreig47k53aipns6nu3u5fxpysp7mogzk6zyvatgpbam7yut3yvtuefa",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "rpc": [
    "https://maro-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.ma.ro"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MARO",
    "symbol": "MARO",
    "decimals": 18
  },
  "infoURL": "https://ma.ro/",
  "shortName": "maro",
  "chainId": 8848,
  "networkId": 8848,
  "explorers": [
    {
      "name": "MARO Scan",
      "url": "https://scan.ma.ro/#",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "maro-blockchain"
} as const;