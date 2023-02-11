export default {
  "name": "Shyft Mainnet",
  "chain": "SHYFT",
  "icon": {
    "url": "ipfs://QmUkFZC2ZmoYPTKf7AHdjwRPZoV2h1MCuHaGM4iu8SNFpi",
    "width": 400,
    "height": 400,
    "format": "svg"
  },
  "rpc": [
    "https://shyft.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shyft.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shyft",
    "symbol": "SHYFT",
    "decimals": 18
  },
  "infoURL": "https://shyft.network",
  "shortName": "shyft",
  "chainId": 7341,
  "networkId": 7341,
  "slip44": 2147490989,
  "explorers": [
    {
      "name": "Shyft BX",
      "url": "https://bx.shyft.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "shyft"
} as const;