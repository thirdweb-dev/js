export default {
  "name": "Gon Chain",
  "chain": "GonChain",
  "icon": {
    "url": "ipfs://QmPtiJGaApbW3ATZhPW3pKJpw3iGVrRGsZLWhrDKF9ZK18",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "rpc": [
    "https://gon-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.testnet.gaiaopen.network",
    "http://database1.gaiaopen.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gon Token",
    "symbol": "GT",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "gon",
  "chainId": 10024,
  "networkId": 10024,
  "explorers": [
    {
      "name": "Gon Explorer",
      "url": "https://gonscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "gon-chain"
} as const;