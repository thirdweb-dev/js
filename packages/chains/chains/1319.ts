export default {
  "name": "Aitd Mainnet",
  "chain": "AITD",
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "rpc": [
    "https://aitd.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://walletrpc.aitd.io",
    "https://node.aitd.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AITD Mainnet",
    "symbol": "AITD",
    "decimals": 18
  },
  "infoURL": "https://www.aitd.io/",
  "shortName": "aitd",
  "chainId": 1319,
  "networkId": 1319,
  "explorers": [
    {
      "name": "AITD Chain Explorer Mainnet",
      "url": "https://aitd-explorer-new.aitd.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "aitd"
} as const;