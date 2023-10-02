import type { Chain } from "../src/types";
export default {
  "chain": "BRB",
  "chainId": 9012,
  "explorers": [
    {
      "name": "berylbit-explorer",
      "url": "https://explorer.berylbit.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://t.me/BerylBit"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmeDXHkpranzqGN1BmQqZSrFp4vGXf4JfaB5iq8WHHiwDi",
    "width": 162,
    "height": 162,
    "format": "png"
  },
  "infoURL": "https://www.beryl-bit.com",
  "name": "BerylBit Mainnet",
  "nativeCurrency": {
    "name": "BerylBit Chain Native Token",
    "symbol": "BRB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://berylbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.berylbit.io"
  ],
  "shortName": "brb",
  "slug": "berylbit",
  "testnet": false
} as const satisfies Chain;