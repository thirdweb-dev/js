import type { Chain } from "../src/types";
export default {
  "chain": "KYMTC",
  "chainId": 24076,
  "explorers": [
    {
      "name": "KYMTC Testnet Explorer",
      "url": "https://testnet-explorer.kymaticscan.online",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmR1AnNYGeXpVmsKyzqktk4K1BtFPiaJpeXuLktb9Kwmer",
        "width": 1042,
        "height": 1038,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.kymaticscan.online"
  ],
  "icon": {
    "url": "ipfs://QmR1AnNYGeXpVmsKyzqktk4K1BtFPiaJpeXuLktb9Kwmer",
    "width": 1042,
    "height": 1038,
    "format": "png"
  },
  "infoURL": "https://testnet-explorer.kymaticscan.online",
  "name": "KYMTC Testnet",
  "nativeCurrency": {
    "name": "KYMTC",
    "symbol": "KYMTC",
    "decimals": 18
  },
  "networkId": 24076,
  "rpc": [
    "https://24076.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.kymaticscan.online"
  ],
  "shortName": "tKYMTC",
  "slug": "kymtc-testnet",
  "testnet": true
} as const satisfies Chain;