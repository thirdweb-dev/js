export default {
  "name": "IDChain Mainnet",
  "chain": "IDChain",
  "rpc": [
    "https://idchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://idchain.one/rpc/",
    "wss://idchain.one/ws/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EIDI",
    "symbol": "EIDI",
    "decimals": 18
  },
  "infoURL": "https://idchain.one/begin/",
  "shortName": "idchain",
  "chainId": 74,
  "networkId": 74,
  "icon": {
    "url": "ipfs://QmZVwsY6HPXScKqZCA9SWNrr4jrQAHkPhVhMWi6Fj1DsrJ",
    "width": 162,
    "height": 129,
    "format": "png"
  },
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.idchain.one",
      "icon": "etherscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "idchain"
} as const;