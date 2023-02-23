export default {
  "name": "Bitindi Testnet",
  "chain": "BNI",
  "icon": {
    "url": "ipfs://QmRAFFPiLiSgjGTs9QaZdnR9fsDgyUdTejwSxcnPXo292s",
    "width": 60,
    "height": 72,
    "format": "png"
  },
  "rpc": [
    "https://bitindi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.bitindi.org"
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
  "shortName": "BNIt",
  "chainId": 4096,
  "networkId": 4096,
  "explorers": [
    {
      "name": "Bitindi",
      "url": "https://testnet.bitindiscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bitindi-testnet"
} as const;