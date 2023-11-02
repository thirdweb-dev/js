import type { Chain } from "../src/types";
export default {
  "chain": "OTP",
  "chainId": 2043,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://parachain.origintrail.io",
  "name": "OriginTrail Parachain",
  "nativeCurrency": {
    "name": "OriginTrail Parachain Token",
    "symbol": "OTP",
    "decimals": 12
  },
  "networkId": 2043,
  "rpc": [
    "https://origintrail-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2043.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://astrosat.origintrail.network",
    "wss://parachain-rpc.origin-trail.network"
  ],
  "shortName": "otp",
  "slug": "origintrail-parachain",
  "testnet": false
} as const satisfies Chain;