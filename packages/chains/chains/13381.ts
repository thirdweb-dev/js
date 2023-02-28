export default {
  "name": "Phoenix Mainnet",
  "chain": "Phoenix",
  "rpc": [
    "https://phoenix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.phoenixplorer.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Phoenix",
    "symbol": "PHX",
    "decimals": 18
  },
  "infoURL": "https://cryptophoenix.org/phoenix",
  "shortName": "Phoenix",
  "chainId": 13381,
  "networkId": 13381,
  "icon": {
    "url": "ipfs://QmYiLMeKDXMSNuQmtxNdxm53xR588pcRXMf7zuiZLjQnc6",
    "width": 1501,
    "height": 1501,
    "format": "png"
  },
  "explorers": [
    {
      "name": "phoenixplorer",
      "url": "https://phoenixplorer.com",
      "icon": "phoenixplorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "phoenix"
} as const;