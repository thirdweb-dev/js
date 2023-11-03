import type { Chain } from "../types";
export default {
  "chain": "GMMT",
  "chainId": 8989,
  "explorers": [
    {
      "name": "gmmtscan",
      "url": "https://scan.gmmtchain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVth4aPeskDTFqRifUugJx6gyEHCmx2PFbMWUtsCSQFkF",
        "width": 468,
        "height": 518,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVth4aPeskDTFqRifUugJx6gyEHCmx2PFbMWUtsCSQFkF",
    "width": 468,
    "height": 518,
    "format": "png"
  },
  "infoURL": "https://gmmtchain.io/",
  "name": "Giant Mammoth Mainnet",
  "nativeCurrency": {
    "name": "Giant Mammoth Coin",
    "symbol": "GMMT",
    "decimals": 18
  },
  "networkId": 8989,
  "rpc": [
    "https://giant-mammoth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8989.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-asia.gmmtchain.io"
  ],
  "shortName": "gmmt",
  "slug": "giant-mammoth",
  "testnet": false,
  "title": "Giant Mammoth Chain"
} as const satisfies Chain;