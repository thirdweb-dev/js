import type { Chain } from "../src/types";
export default {
  "chain": "OEX",
  "chainId": 7798,
  "explorers": [
    {
      "name": "OpenEX Long Testnet Explorer",
      "url": "https://scan.long.openex.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreidnu6p6vmmplerzvkboq7fz73ygkomzpnnokuxstrqv2fvxgmgg7i",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://long.hub.openex.network/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreidnu6p6vmmplerzvkboq7fz73ygkomzpnnokuxstrqv2fvxgmgg7i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://openex.network",
  "name": "OpenEX LONG Testnet",
  "nativeCurrency": {
    "name": "USDT Testnet",
    "symbol": "USDT",
    "decimals": 18
  },
  "networkId": 7798,
  "rpc": [
    "https://7798.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://long.rpc.openex.network/"
  ],
  "shortName": "oex",
  "slip44": 1,
  "slug": "openex-long-testnet",
  "testnet": true,
  "title": "OpenEX LONG Testnet"
} as const satisfies Chain;