import type { Chain } from "../src/types";
export default {
  "chainId": 50,
  "chain": "XDC",
  "name": "XinFin XDC Network",
  "rpc": [
    "https://xinfin-xdc-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc.xinfin.network",
    "https://rpc.xinfin.network",
    "https://rpc1.xinfin.network",
    "https://rpc-xdc.icecreamswap.com"
  ],
  "slug": "xinfin-xdc-network",
  "icon": {
    "url": "ipfs://QmeRq7pabiJE2n1xU3Y5Mb4TZSX9kQ74x7a3P2Z4PqcMRX",
    "width": 1450,
    "height": 1450,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "XDC",
    "decimals": 18
  },
  "infoURL": "https://xinfin.org",
  "shortName": "xdc",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;