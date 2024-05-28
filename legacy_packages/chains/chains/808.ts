import type { Chain } from "../src/types";
export default {
  "chain": "PF",
  "chainId": 808,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://portalfantasy.io",
  "name": "Portal Fantasy Chain Test",
  "nativeCurrency": {
    "name": "Portal Fantasy Token",
    "symbol": "PFT",
    "decimals": 18
  },
  "networkId": 808,
  "rpc": [
    "https://808.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/portal-fantasy/testnet/rpc"
  ],
  "shortName": "PFTEST",
  "slip44": 1,
  "slug": "portal-fantasy-chain-test",
  "testnet": true
} as const satisfies Chain;