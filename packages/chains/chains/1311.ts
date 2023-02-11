export default {
  "name": "Dos Fuji Subnet",
  "chain": "DOS",
  "rpc": [
    "https://dos-fuji-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.doschain.com/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dos Native Token",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "http://doschain.io/",
  "shortName": "DOS",
  "chainId": 1311,
  "networkId": 1311,
  "explorers": [
    {
      "name": "dos-testnet",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dos-fuji-subnet"
} as const;