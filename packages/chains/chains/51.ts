import type { Chain } from "../src/types";
export default {
  "chain": "XDC",
  "chainId": 51,
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://apothem.xinfinscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmPzVFs16GwaD8LAcGFLCNXzEK8BHFKNXeM3nmBpnq9xy3",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    },
    {
      "name": "blocksscan",
      "url": "https://apothem.blocksscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmPzVFs16GwaD8LAcGFLCNXzEK8BHFKNXeM3nmBpnq9xy3",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.apothem.network"
  ],
  "icon": {
    "url": "ipfs://QmeRq7pabiJE2n1xU3Y5Mb4TZSX9kQ74x7a3P2Z4PqcMRX",
    "width": 1450,
    "height": 1450,
    "format": "png"
  },
  "infoURL": "https://xinfin.org",
  "name": "XDC Apothem Network",
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "TXDC",
    "decimals": 18
  },
  "networkId": 51,
  "rpc": [
    "https://xdc-apothem-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://51.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.apothem.network",
    "https://erpc.apothem.network"
  ],
  "shortName": "txdc",
  "slug": "xdc-apothem-network",
  "testnet": false
} as const satisfies Chain;