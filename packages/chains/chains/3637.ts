import type { Chain } from "../src/types";
export default {
  "chainId": 3637,
  "chain": "BTC",
  "name": "Botanix Mainnet",
  "rpc": [
    "https://botanix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.btxtestchain.com"
  ],
  "slug": "botanix",
  "icon": {
    "url": "ipfs://Qmf2iSjcrZwUDKhCVY9ZzfbSV2He2HSssbcG2yMz1mDerm",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "faucets": [
    "https://faucet.btxtestchain.com"
  ],
  "nativeCurrency": {
    "name": "Botanix",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://btxtestchain.com",
  "shortName": "BTCm",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Botanix",
      "url": "https://btxtestchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;