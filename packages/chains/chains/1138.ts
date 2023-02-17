export default {
  "name": "AmStar Testnet",
  "chain": "AmStar",
  "icon": {
    "url": "ipfs://Qmd4TMQdnYxaUZqnVddh5S37NGH72g2kkK38ccCEgdZz1C",
    "width": 599,
    "height": 563,
    "format": "png"
  },
  "rpc": [
    "https://amstar-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.amstarscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "infoURL": "https://sinso.io",
  "shortName": "ASARt",
  "chainId": 1138,
  "networkId": 1138,
  "explorers": [
    {
      "name": "amstarscan-testnet",
      "url": "https://testnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "amstar-testnet"
} as const;