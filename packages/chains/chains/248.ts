export default {
  "name": "Oasys Mainnet",
  "chain": "Oasys",
  "icon": {
    "url": "ipfs://QmT84suD2ZmTSraJBfeHhTNst2vXctQijNCztok9XiVcUR",
    "width": 3600,
    "height": 3600,
    "format": "png"
  },
  "rpc": [
    "https://oasys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.games"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://oasys.games",
  "shortName": "OAS",
  "chainId": 248,
  "networkId": 248,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.oasys.games",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "oasys"
} as const;