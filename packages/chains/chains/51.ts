import type { Chain } from "../src/types";
export default {
  "name": "XDC Apothem Network",
  "chain": "XDC",
  "rpc": [
    "https://xdc-apothem-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.apothem.network",
    "https://erpc.apothem.network"
  ],
  "faucets": [
    "https://faucet.apothem.network"
  ],
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "TXDC",
    "decimals": 18
  },
  "infoURL": "https://xinfin.org",
  "shortName": "txdc",
  "chainId": 51,
  "networkId": 51,
  "icon": {
    "url": "ipfs://QmeRq7pabiJE2n1xU3Y5Mb4TZSX9kQ74x7a3P2Z4PqcMRX",
    "width": 1450,
    "height": 1450,
    "format": "png"
  },
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://apothem.xinfinscan.com",
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
      "url": "https://apothem.blocksscan.io",
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
  "slug": "xdc-apothem-network"
} as const satisfies Chain;