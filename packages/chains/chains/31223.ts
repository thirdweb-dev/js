import type { Chain } from "../src/types";
export default {
  "chainId": 31223,
  "chain": "CLD",
  "name": "CloudTx Mainnet",
  "rpc": [
    "https://cloudtx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.cloudtx.finance"
  ],
  "slug": "cloudtx",
  "icon": {
    "url": "ipfs://QmSEsi71AdA5HYH6VNC5QUQezFg1C7BiVQJdx1VVfGz3g3",
    "width": 713,
    "height": 830,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "infoURL": "https://cloudtx.finance",
  "shortName": "CLDTX",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "cloudtxscan",
      "url": "https://scan.cloudtx.finance",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;