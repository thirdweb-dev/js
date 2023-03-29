export default {
  "name": "Blockton Blockchain",
  "chain": "Blockton Blockchain",
  "icon": {
    "url": "ipfs://bafkreig3hoedafisrgc6iffdo2jcblm6kov35h72gcblc3zkmt7t4ucwhy",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://blockton-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blocktonscan.com/"
  ],
  "faucets": [
    "https://faucet.blocktonscan.com/"
  ],
  "nativeCurrency": {
    "name": "BLOCKTON",
    "symbol": "BTON",
    "decimals": 18
  },
  "infoURL": "https://blocktoncoin.com",
  "shortName": "BTON",
  "chainId": 8272,
  "networkId": 8272,
  "explorers": [
    {
      "name": "Blockton Explorer",
      "url": "https://blocktonscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "blockton-blockchain"
} as const;