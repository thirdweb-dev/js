import type { Chain } from "../src/types";
export default {
  "chainId": 3636,
  "chain": "BTC",
  "name": "Botanix Testnet",
  "rpc": [
    "https://botanix-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.btxtestchain.com"
  ],
  "slug": "botanix-testnet",
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
  "shortName": "BTCt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Botanix",
      "url": "https://testnet.btxtestchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;