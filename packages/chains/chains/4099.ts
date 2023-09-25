import type { Chain } from "../src/types";
export default {
  "chainId": 4099,
  "chain": "BNI",
  "name": "Bitindi Mainnet",
  "rpc": [
    "https://bitindi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    " https://rpc-mainnet.bitindi.org",
    "https://mainnet-rpc.bitindi.org"
  ],
  "slug": "bitindi",
  "icon": {
    "url": "ipfs://QmRAFFPiLiSgjGTs9QaZdnR9fsDgyUdTejwSxcnPXo292s",
    "width": 60,
    "height": 72,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitindi",
      "url": "https://bitindiscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;