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
  "icon": "xdc",
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://apothem.xinfinscan.com",
      "icon": "blocksscan",
      "standard": "EIP3091"
    },
    {
      "name": "blocksscan",
      "url": "https://apothem.blocksscan.io",
      "icon": "blocksscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "xdc-apothem-network"
} as const satisfies Chain;