import type { Chain } from "../src/types";
export default {
  "name": "Botanix Testnet",
  "chain": "BTC",
  "icon": {
    "url": "ipfs://Qmf2iSjcrZwUDKhCVY9ZzfbSV2He2HSssbcG2yMz1mDerm",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "rpc": [
    "https://botanix-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.btxtestchain.com"
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
  "shortName": "BTCt",
  "chainId": 3636,
  "networkId": 3636,
  "explorers": [
    {
      "name": "Botanix",
      "url": "https://testnet.btxtestchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "botanix-testnet"
} as const satisfies Chain;