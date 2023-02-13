export default {
  "name": "Piece testnet",
  "chain": "PieceNetwork",
  "icon": {
    "url": "ipfs://QmWAU39z1kcYshAqkENRH8qUjfR5CJehCxA4GiC33p3HpH",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "rpc": [
    "https://piece-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc0.piecenetwork.com"
  ],
  "faucets": [
    "https://piecenetwork.com/faucet"
  ],
  "nativeCurrency": {
    "name": "ECE",
    "symbol": "ECE",
    "decimals": 18
  },
  "infoURL": "https://piecenetwork.com",
  "shortName": "Piece",
  "chainId": 30067,
  "networkId": 30067,
  "explorers": [
    {
      "name": "Piece Scan",
      "url": "https://testnet-scan.piecenetwork.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "piece-testnet"
} as const;