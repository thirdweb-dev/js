import type { Chain } from "../src/types";
export default {
  "chain": "FFG",
  "chainId": 191,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreihsas2rwakc7lllmtb4pcgwutlel2woibmqmhd4aiin342zgtpmwy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://filefilego.com",
  "name": "FileFileGo",
  "nativeCurrency": {
    "name": "FFG",
    "symbol": "FFG",
    "decimals": 18
  },
  "networkId": 191,
  "rpc": [
    "https://191.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.filefilego.com/rpc"
  ],
  "shortName": "ffg",
  "slug": "filefilego",
  "testnet": false
} as const satisfies Chain;