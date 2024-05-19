import type { Chain } from "../src/types";
export default {
  "chain": "LBRY",
  "chainId": 19600,
  "explorers": [
    {
      "name": "LBRY Block Explorer",
      "url": "https://explorer.lbry.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmUoSiFWaPTbVY6ZfJswzrM9jKuhfhXWwstRo49cVCWr8x",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmUoSiFWaPTbVY6ZfJswzrM9jKuhfhXWwstRo49cVCWr8x",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://lbry.com",
  "name": "LBRY Mainnet",
  "nativeCurrency": {
    "name": "LBRY Credits",
    "symbol": "LBC",
    "decimals": 8
  },
  "networkId": 19600,
  "rpc": [
    "https://19600.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://lbry.nl/rpc"
  ],
  "shortName": "LBRY",
  "slip44": 140,
  "slug": "lbry",
  "testnet": false
} as const satisfies Chain;