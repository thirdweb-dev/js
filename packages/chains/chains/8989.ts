import type { Chain } from "../src/types";
export default {
  "chainId": 8989,
  "chain": "GMMT",
  "name": "Giant Mammoth Mainnet",
  "rpc": [
    "https://giant-mammoth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-asia.gmmtchain.io"
  ],
  "slug": "giant-mammoth",
  "icon": {
    "url": "ipfs://QmVth4aPeskDTFqRifUugJx6gyEHCmx2PFbMWUtsCSQFkF",
    "width": 468,
    "height": 518,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Giant Mammoth Coin",
    "symbol": "GMMT",
    "decimals": 18
  },
  "infoURL": "https://gmmtchain.io/",
  "shortName": "gmmt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "gmmtscan",
      "url": "https://scan.gmmtchain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;