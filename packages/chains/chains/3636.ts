import type { Chain } from "../src/types";
export default {
  "chain": "BTC",
  "chainId": 3636,
  "explorers": [
    {
      "name": "Botanix",
      "url": "https://testnet.btxtestchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.btxtestchain.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://Qmf2iSjcrZwUDKhCVY9ZzfbSV2He2HSssbcG2yMz1mDerm",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "infoURL": "https://btxtestchain.com",
  "name": "Botanix Testnet",
  "nativeCurrency": {
    "name": "Botanix",
    "symbol": "BTC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://botanix-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.btxtestchain.com"
  ],
  "shortName": "BTCt",
  "slug": "botanix-testnet",
  "testnet": true
} as const satisfies Chain;