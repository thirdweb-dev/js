import type { Chain } from "../src/types";
export default {
  "chain": "CLD",
  "chainId": 31223,
  "explorers": [
    {
      "name": "cloudtxscan",
      "url": "https://scan.cloudtx.finance",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSEsi71AdA5HYH6VNC5QUQezFg1C7BiVQJdx1VVfGz3g3",
    "width": 713,
    "height": 830,
    "format": "png"
  },
  "infoURL": "https://cloudtx.finance",
  "name": "CloudTx Mainnet",
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "networkId": 31223,
  "rpc": [
    "https://cloudtx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://31223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.cloudtx.finance"
  ],
  "shortName": "CLDTX",
  "slug": "cloudtx",
  "testnet": false
} as const satisfies Chain;