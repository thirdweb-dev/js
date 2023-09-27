import type { Chain } from "../src/types";
export default {
  "name": "XinFin XDC Network",
  "chain": "XDC",
  "rpc": [
    "https://xinfin-xdc-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc.xinfin.network",
    "https://rpc.xinfin.network",
    "https://rpc1.xinfin.network",
    "https://rpc-xdc.icecreamswap.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "XDC",
    "decimals": 18
  },
  "infoURL": "https://xinfin.org",
  "shortName": "xdc",
  "chainId": 50,
  "networkId": 50,
  "icon": "xdc",
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://xdcscan.io",
      "icon": "blocksscan",
      "standard": "EIP3091"
    },
    {
      "name": "blocksscan",
      "url": "https://xdc.blocksscan.io",
      "icon": "blocksscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "xinfin-xdc-network"
} as const satisfies Chain;