export default {
  "name": "Gitshock Cartenz Testnet",
  "chain": "Gitshock Cartenz",
  "icon": {
    "url": "ipfs://bafkreifqpj5jkjazvh24muc7wv4r22tihzzl75cevgecxhvojm4ls6mzpq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://gitshock-cartenz-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cartenz.works"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gitshock Cartenz",
    "symbol": "tGTFX",
    "decimals": 18
  },
  "infoURL": "https://gitshock.com",
  "shortName": "gitshockchain",
  "chainId": 1881,
  "networkId": 1881,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.cartenz.works",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "gitshock-cartenz-testnet"
} as const;