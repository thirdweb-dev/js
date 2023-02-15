export default {
  "name": "Metaplayerone Mainnet",
  "chain": "METAD",
  "icon": {
    "url": "ipfs://QmZyxS9BfRGYWWDtvrV6qtthCYV4TwdjLoH2sF6MkiTYFf",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://metaplayerone.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metaplayer.one/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "METAD",
    "symbol": "METAD",
    "decimals": 18
  },
  "infoURL": "https://docs.metaplayer.one/",
  "shortName": "Metad",
  "chainId": 2122,
  "networkId": 2122,
  "explorers": [
    {
      "name": "Metad Scan",
      "url": "https://scan.metaplayer.one",
      "icon": "metad",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "metaplayerone"
} as const;