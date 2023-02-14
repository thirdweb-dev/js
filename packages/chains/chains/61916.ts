export default {
  "name": "DoKEN Super Chain Mainnet",
  "chain": "DoKEN Super Chain",
  "rpc": [
    "https://doken-super-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sgrpc.doken.dev",
    "https://nyrpc.doken.dev",
    "https://ukrpc.doken.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DoKEN",
    "symbol": "DKN",
    "decimals": 18
  },
  "infoURL": "https://doken.dev/",
  "shortName": "DoKEN",
  "chainId": 61916,
  "networkId": 61916,
  "icon": {
    "url": "ipfs://bafkreifms4eio6v56oyeemnnu5luq3sc44hptan225lr45itgzu3u372iu",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "DSC Scan",
      "url": "https://explore.doken.dev",
      "icon": "doken",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "doken-super-chain"
} as const;