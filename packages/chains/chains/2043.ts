import type { Chain } from "../src/types";
export default {
  "chainId": 2043,
  "chain": "OTP",
  "name": "OriginTrail Parachain",
  "rpc": [
    "https://origintrail-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://astrosat.origintrail.network",
    "wss://parachain-rpc.origin-trail.network"
  ],
  "slug": "origintrail-parachain",
  "faucets": [],
  "nativeCurrency": {
    "name": "OriginTrail Parachain Token",
    "symbol": "OTP",
    "decimals": 12
  },
  "infoURL": "https://parachain.origintrail.io",
  "shortName": "otp",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;