import type { Chain } from "../src/types";
export default {
  "chain": "Ankara",
  "chainId": 72778,
  "explorers": [
    {
      "name": "ankara",
      "url": "https://explorer.ankara-cagacrypto.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmeiop9gSdzU4NNJ6GCuPk6AeYwD9pbhEFVfRdk4dXs3kJ",
    "width": 640,
    "height": 640,
    "format": "png"
  },
  "infoURL": "https://www.cagacrypto.com/",
  "name": "CAGA crypto Ankara testnet",
  "nativeCurrency": {
    "name": "Caga",
    "symbol": "CAGA",
    "decimals": 18
  },
  "networkId": 72778,
  "rpc": [
    "https://72778.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.ankara-cagacrypto.com",
    "wss://wss.ankara-cagacrypto.com"
  ],
  "shortName": "caga",
  "slug": "caga-crypto-ankara-testnet",
  "testnet": true
} as const satisfies Chain;