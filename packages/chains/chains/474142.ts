export default {
  "name": "OpenChain Mainnet",
  "chain": "OpenChain",
  "rpc": [
    "https://openchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baas-rpc.luniverse.io:18545?lChainId=1641349324562974539"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OpenCoin",
    "symbol": "OPC",
    "decimals": 10
  },
  "infoURL": "https://www.openchain.live",
  "shortName": "oc",
  "chainId": 474142,
  "networkId": 474142,
  "explorers": [
    {
      "name": "SIDE SCAN",
      "url": "https://sidescan.luniverse.io/1641349324562974539",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "openchain"
} as const;