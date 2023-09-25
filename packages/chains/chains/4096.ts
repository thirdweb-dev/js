import type { Chain } from "../src/types";
export default {
  "chainId": 4096,
  "chain": "BNI",
  "name": "Bitindi Testnet",
  "rpc": [
    "https://bitindi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bitindi.org",
    "https://testnet-rpc.bitindi.org"
  ],
  "slug": "bitindi-testnet",
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
  "shortName": "BNIt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitindi",
      "url": "https://testnet.bitindiscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;