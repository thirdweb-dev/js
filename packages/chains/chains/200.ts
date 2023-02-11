export default {
  "name": "Arbitrum on xDai",
  "chain": "AOX",
  "rpc": [
    "https://arbitrum-on-xdai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum.xdaichain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://xdaichain.com",
  "shortName": "aox",
  "chainId": 200,
  "networkId": 200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/xdai/arbitrum",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "chain": "eip155-100",
    "type": "L2"
  },
  "testnet": false,
  "slug": "arbitrum-on-xdai"
} as const;