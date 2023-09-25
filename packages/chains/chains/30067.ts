import type { Chain } from "../src/types";
export default {
  "chainId": 30067,
  "chain": "PieceNetwork",
  "name": "Piece testnet",
  "rpc": [
    "https://piece-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc0.piecenetwork.com"
  ],
  "slug": "piece-testnet",
  "icon": {
    "url": "ipfs://QmWAU39z1kcYshAqkENRH8qUjfR5CJehCxA4GiC33p3HpH",
    "width": 800,
    "height": 800,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Piece Scan",
      "url": "https://testnet-scan.piecenetwork.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;