import type { Chain } from "../src/types";
export default {
  "name": "Botanix Mainnet",
  "chain": "BTC",
  "icon": {
    "url": "ipfs://Qmf2iSjcrZwUDKhCVY9ZzfbSV2He2HSssbcG2yMz1mDerm",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "rpc": [
    "https://botanix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.btxtestchain.com"
  ],
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
  "chainId": 3637,
  "networkId": 3637,
  "explorers": [
    {
      "name": "Botanix",
      "url": "https://btxtestchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "botanix"
} as const satisfies Chain;