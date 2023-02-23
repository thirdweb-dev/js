export default {
  "name": "OriginTrail Parachain",
  "chain": "OTP",
  "rpc": [
    "https://origintrail-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://astrosat.origintrail.network",
    "wss://parachain-rpc.origin-trail.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OriginTrail Parachain Token",
    "symbol": "OTP",
    "decimals": 12
  },
  "infoURL": "https://parachain.origintrail.io",
  "shortName": "otp",
  "chainId": 2043,
  "networkId": 2043,
  "testnet": false,
  "slug": "origintrail-parachain"
} as const;