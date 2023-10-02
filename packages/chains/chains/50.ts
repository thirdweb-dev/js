import type { Chain } from "../src/types";
export default {
  "chain": "XDC",
  "chainId": 50,
  "explorers": [
    {
      "name": "blocksscan",
      "url": "https://xdc.blocksscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "xdcscan",
      "url": "https://xdcscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmeRq7pabiJE2n1xU3Y5Mb4TZSX9kQ74x7a3P2Z4PqcMRX",
    "width": 1450,
    "height": 1450,
    "format": "png"
  },
  "infoURL": "https://xinfin.org",
  "name": "XinFin XDC Network",
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "XDC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://xinfin-xdc-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc.xinfin.network",
    "https://rpc.xinfin.network",
    "https://rpc1.xinfin.network",
    "https://rpc-xdc.icecreamswap.com"
  ],
  "shortName": "xdc",
  "slug": "xinfin-xdc-network",
  "testnet": false
} as const satisfies Chain;