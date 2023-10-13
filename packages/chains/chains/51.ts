import type { Chain } from "../src/types";
export default {
  "chain": "XDC",
  "chainId": 51,
  "explorers": [
    {
      "name": "blocksscan",
      "url": "https://apothem.blocksscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "xdcscan",
      "url": "https://apothem.xinfinscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.apothem.network"
  ],
  "features": [],
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
    "symbol": "XDC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://xdc-apothem-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.apothem.network",
    "https://erpc.apothem.network"
  ],
  "shortName": "txdc",
  "slug": "xdc-apothem-network",
  "testnet": false
} as const satisfies Chain;