import type { Chain } from "../src/types";
export default {
  "chainId": 909,
  "chain": "PF",
  "name": "Portal Fantasy Chain",
  "rpc": [],
  "slug": "portal-fantasy-chain",
  "icon": {
    "url": "ipfs://QmeMa6aw3ebUKJdGgbzDgcVtggzp7cQdfSrmzMYmnt5ywc",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Portal Fantasy Token",
    "symbol": "PFT",
    "decimals": 18
  },
  "infoURL": "https://portalfantasy.io",
  "shortName": "PF",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;