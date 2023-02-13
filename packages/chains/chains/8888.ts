export default {
  "name": "XANAChain",
  "chain": "XANAChain",
  "rpc": [
    "https://xanachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.xana.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XETA",
    "symbol": "XETA",
    "decimals": 18
  },
  "infoURL": "https://xanachain.xana.net/",
  "shortName": "XANAChain",
  "chainId": 8888,
  "networkId": 8888,
  "icon": {
    "url": "ipfs://QmWGNfwJ9o2vmKD3E6fjrxpbFP8W5q45zmYzHHoXwqqAoj",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "XANAChain",
      "url": "https://xanachain.xana.net",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "xanachain"
} as const;