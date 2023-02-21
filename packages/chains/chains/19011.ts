export default {
  "name": "HOME Verse Mainnet",
  "chain": "HOME Verse",
  "icon": {
    "url": "ipfs://QmeGb65zSworzoHmwK3jdkPtEsQZMUSJRxf8K8Feg56soU",
    "width": 597,
    "height": 597,
    "format": "png"
  },
  "rpc": [
    "https://home-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.homeverse.games/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.homeverse.games/",
  "shortName": "HMV",
  "chainId": 19011,
  "networkId": 19011,
  "explorers": [
    {
      "name": "HOME Verse Explorer",
      "url": "https://explorer.oasys.homeverse.games",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "testnet": false,
  "slug": "home-verse"
} as const;