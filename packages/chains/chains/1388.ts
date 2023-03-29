export default {
  "name": "AmStar Mainnet",
  "chain": "AmStar",
  "icon": {
    "url": "ipfs://Qmd4TMQdnYxaUZqnVddh5S37NGH72g2kkK38ccCEgdZz1C",
    "width": 599,
    "height": 563,
    "format": "png"
  },
  "rpc": [
    "https://amstar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.amstarscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "infoURL": "https://sinso.io",
  "shortName": "ASAR",
  "chainId": 1388,
  "networkId": 1388,
  "explorers": [
    {
      "name": "amstarscan",
      "url": "https://mainnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "amstar"
} as const;