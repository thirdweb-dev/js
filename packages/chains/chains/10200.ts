export default {
  "name": "Chiado Testnet",
  "chain": "CHI",
  "icon": {
    "url": "ipfs://bafybeidk4swpgdyqmpz6shd5onvpaujvwiwthrhypufnwr6xh3dausz2dm",
    "width": 1800,
    "height": 1800,
    "format": "png"
  },
  "rpc": [
    "https://chiado-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chiadochain.net",
    "https://rpc.eu-central-2.gateway.fm/v3/gnosis/archival/chiado"
  ],
  "faucets": [
    "https://gnosisfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Chiado xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://docs.gnosischain.com",
  "shortName": "chi",
  "chainId": 10200,
  "networkId": 10200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.chiadochain.net",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "chiado-testnet"
} as const;