export default {
  "name": "BitYuan Mainnet",
  "chain": "BTY",
  "rpc": [
    "https://bityuan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bityuan.com/eth"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTY",
    "symbol": "BTY",
    "decimals": 18
  },
  "infoURL": "https://www.bityuan.com",
  "shortName": "bty",
  "chainId": 2999,
  "networkId": 2999,
  "icon": {
    "url": "ipfs://QmUmJVof2m5e4HUXb3GmijWUFsLUNhrQiwwQG3CqcXEtHt",
    "width": 91,
    "height": 24,
    "format": "png"
  },
  "explorers": [
    {
      "name": "BitYuan Block Chain Explorer",
      "url": "https://mainnet.bityuan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bityuan"
} as const;