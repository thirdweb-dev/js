import type { Chain } from "../types";
export default {
  "chain": "BNI",
  "chainId": 4096,
  "explorers": [
    {
      "name": "Bitindi",
      "url": "https://testnet.bitindiscan.com",
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
  "name": "Bitindi Testnet",
  "nativeCurrency": {
    "name": "BNI",
    "symbol": "$BNI",
    "decimals": 18
  },
  "networkId": 4096,
  "redFlags": [],
  "rpc": [
    "https://bitindi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4096.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bitindi.org",
    "https://testnet-rpc.bitindi.org"
  ],
  "shortName": "BNIt",
  "slug": "bitindi-testnet",
  "testnet": true
} as const satisfies Chain;