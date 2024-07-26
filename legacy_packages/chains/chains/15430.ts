import type { Chain } from "../src/types";
export default {
  "chain": "KYMTC",
  "chainId": 15430,
  "explorers": [
    {
      "name": "KYMTC Mainnet Explorer",
      "url": "https://kymaticscan.online",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmR1AnNYGeXpVmsKyzqktk4K1BtFPiaJpeXuLktb9Kwmer",
        "width": 1042,
        "height": 1038,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmR1AnNYGeXpVmsKyzqktk4K1BtFPiaJpeXuLktb9Kwmer",
    "width": 1042,
    "height": 1038,
    "format": "png"
  },
  "infoURL": "https://kymaticscan.online",
  "name": "KYMTC Mainnet",
  "nativeCurrency": {
    "name": "KYMTC",
    "symbol": "KYMTC",
    "decimals": 18
  },
  "networkId": 15430,
  "rpc": [
    "https://15430.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.kymaticscan.online"
  ],
  "shortName": "KYMTC",
  "slug": "kymtc",
  "testnet": false
} as const satisfies Chain;