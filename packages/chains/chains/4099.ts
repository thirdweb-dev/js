import type { Chain } from "../src/types";
export default {
  "chain": "BNI",
  "chainId": 4099,
  "explorers": [
    {
      "name": "Bitindi",
      "url": "https://bitindiscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bitindi.org"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmRAFFPiLiSgjGTs9QaZdnR9fsDgyUdTejwSxcnPXo292s",
    "width": 60,
    "height": 72,
    "format": "png"
  },
  "infoURL": "https://bitindi.org",
  "name": "Bitindi Mainnet",
  "nativeCurrency": {
    "name": "BNI",
    "symbol": "$BNI",
    "decimals": 18
  },
  "networkId": 4099,
  "redFlags": [],
  "rpc": [
    "https://bitindi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4099.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    " https://rpc-mainnet.bitindi.org",
    "https://mainnet-rpc.bitindi.org"
  ],
  "shortName": "BNIm",
  "slug": "bitindi",
  "testnet": false
} as const satisfies Chain;