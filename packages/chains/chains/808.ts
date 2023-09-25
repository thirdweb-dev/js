import type { Chain } from "../src/types";
export default {
  "chainId": 808,
  "chain": "PF",
  "name": "Portal Fantasy Chain Test",
  "rpc": [
    "https://portal-fantasy-chain-test.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/portal-fantasy/testnet/rpc"
  ],
  "slug": "portal-fantasy-chain-test",
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
  "shortName": "PFTEST",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;