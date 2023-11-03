import type { Chain } from "../types";
export default {
  "chain": "CloudTx",
  "chainId": 31224,
  "explorers": [
    {
      "name": "cloudtxexplorer",
      "url": "https://explorer.cloudtx.finance",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.cloudtx.finance"
  ],
  "icon": {
    "url": "ipfs://QmSEsi71AdA5HYH6VNC5QUQezFg1C7BiVQJdx1VVfGz3g3",
    "width": 713,
    "height": 830,
    "format": "png"
  },
  "infoURL": "https://cloudtx.finance/",
  "name": "CloudTx Testnet",
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "networkId": 31224,
  "rpc": [
    "https://cloudtx-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://31224.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.cloudtx.finance"
  ],
  "shortName": "CLD",
  "slug": "cloudtx-testnet",
  "testnet": true
} as const satisfies Chain;