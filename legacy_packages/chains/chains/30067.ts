import type { Chain } from "../src/types";
export default {
  "chain": "PieceNetwork",
  "chainId": 30067,
  "explorers": [
    {
      "name": "Piece Scan",
      "url": "https://testnet-scan.piecenetwork.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://piecenetwork.com/faucet"
  ],
  "icon": {
    "url": "ipfs://QmWAU39z1kcYshAqkENRH8qUjfR5CJehCxA4GiC33p3HpH",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://piecenetwork.com",
  "name": "Piece testnet",
  "nativeCurrency": {
    "name": "ECE",
    "symbol": "ECE",
    "decimals": 18
  },
  "networkId": 30067,
  "rpc": [
    "https://30067.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc0.piecenetwork.com"
  ],
  "shortName": "Piece",
  "slip44": 1,
  "slug": "piece-testnet",
  "testnet": true
} as const satisfies Chain;