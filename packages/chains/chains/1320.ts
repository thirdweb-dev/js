export default {
  "name": "Aitd Testnet",
  "chain": "AITD",
  "icon": {
    "url": "ipfs://QmXbBMMhjTTGAGjmqMpJm3ufFrtdkfEXCFyXYgz7nnZzsy",
    "width": 160,
    "height": 160,
    "format": "png"
  },
  "rpc": [
    "https://aitd-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://http-testnet.aitd.io"
  ],
  "faucets": [
    "https://aitd-faucet-pre.aitdcoin.com/"
  ],
  "nativeCurrency": {
    "name": "AITD Testnet",
    "symbol": "AITD",
    "decimals": 18
  },
  "infoURL": "https://www.aitd.io/",
  "shortName": "aitdtestnet",
  "chainId": 1320,
  "networkId": 1320,
  "explorers": [
    {
      "name": "AITD Chain Explorer Testnet",
      "url": "https://block-explorer-testnet.aitd.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "aitd-testnet"
} as const;