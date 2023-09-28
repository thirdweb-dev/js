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
  "icon": {
    "url": "ipfs://QmeRq7pabiJE2n1xU3Y5Mb4TZSX9kQ74x7a3P2Z4PqcMRX",
    "width": 1450,
    "height": 1450,
    "format": "png"
  },
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://xdcscan.io",
      "icon": {
        "url": "ipfs://QmPzVFs16GwaD8LAcGFLCNXzEK8BHFKNXeM3nmBpnq9xy3",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    },
    {
      "name": "blocksscan",
      "url": "https://xdc.blocksscan.io",
      "icon": {
        "url": "ipfs://QmPzVFs16GwaD8LAcGFLCNXzEK8BHFKNXeM3nmBpnq9xy3",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "xinfin-xdc-network"
} as const satisfies Chain;