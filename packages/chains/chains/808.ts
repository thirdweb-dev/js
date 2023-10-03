import type { Chain } from "../src/types";
export default {
  "chain": "PF",
  "chainId": 808,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmeMa6aw3ebUKJdGgbzDgcVtggzp7cQdfSrmzMYmnt5ywc",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://portalfantasy.io",
  "name": "Portal Fantasy Chain Test",
  "nativeCurrency": {
    "name": "Portal Fantasy Token",
    "symbol": "PFT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://portal-fantasy-chain-test.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/portal-fantasy/testnet/rpc"
  ],
  "shortName": "PFTEST",
  "slug": "portal-fantasy-chain-test",
  "testnet": true
} as const satisfies Chain;