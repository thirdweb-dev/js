import type { Chain } from "../src/types";
export default {
  "chainId": 51,
  "chain": "XDC",
  "name": "XDC Apothem Network",
  "rpc": [
    "https://xdc-apothem-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.apothem.network",
    "https://erpc.apothem.network"
  ],
  "slug": "xdc-apothem-network",
  "icon": {
    "url": "ipfs://QmeRq7pabiJE2n1xU3Y5Mb4TZSX9kQ74x7a3P2Z4PqcMRX",
    "width": 1450,
    "height": 1450,
    "format": "png"
  },
  "faucets": [
    "https://faucet.apothem.network"
  ],
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "XDC",
    "decimals": 18
  },
  "infoURL": "https://xinfin.org",
  "shortName": "txdc",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;