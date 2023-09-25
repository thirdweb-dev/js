import type { Chain } from "../src/types";
export default {
  "chainId": 31224,
  "chain": "CloudTx",
  "name": "CloudTx Testnet",
  "rpc": [
    "https://cloudtx-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.cloudtx.finance"
  ],
  "slug": "cloudtx-testnet",
  "icon": {
    "url": "ipfs://QmSEsi71AdA5HYH6VNC5QUQezFg1C7BiVQJdx1VVfGz3g3",
    "width": 713,
    "height": 830,
    "format": "png"
  },
  "faucets": [
    "https://faucet.cloudtx.finance"
  ],
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "infoURL": "https://cloudtx.finance/",
  "shortName": "CLD",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "cloudtxexplorer",
      "url": "https://explorer.cloudtx.finance",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;