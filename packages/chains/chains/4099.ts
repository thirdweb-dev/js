export default {
  "name": "Bitindi Mainnet",
  "chain": "BNI",
  "icon": {
    "url": "ipfs://QmRAFFPiLiSgjGTs9QaZdnR9fsDgyUdTejwSxcnPXo292s",
    "width": 60,
    "height": 72,
    "format": "png"
  },
  "rpc": [
    "https://bitindi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.bitindi.org"
  ],
  "faucets": [
    "https://faucet.bitindi.org"
  ],
  "nativeCurrency": {
    "name": "BNI",
    "symbol": "$BNI",
    "decimals": 18
  },
  "infoURL": "https://bitindi.org",
  "shortName": "BNIm",
  "chainId": 4099,
  "networkId": 4099,
  "explorers": [
    {
      "name": "Bitindi",
      "url": "https://bitindiscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitindi"
} as const;