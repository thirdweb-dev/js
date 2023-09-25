import type { Chain } from "../src/types";
export default {
  "chainId": 9012,
  "chain": "BRB",
  "name": "BerylBit Mainnet",
  "rpc": [
    "https://berylbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.berylbit.io"
  ],
  "slug": "berylbit",
  "icon": {
    "url": "ipfs://QmeDXHkpranzqGN1BmQqZSrFp4vGXf4JfaB5iq8WHHiwDi",
    "width": 162,
    "height": 162,
    "format": "png"
  },
  "faucets": [
    "https://t.me/BerylBit"
  ],
  "nativeCurrency": {
    "name": "BerylBit Chain Native Token",
    "symbol": "BRB",
    "decimals": 18
  },
  "infoURL": "https://www.beryl-bit.com",
  "shortName": "brb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "berylbit-explorer",
      "url": "https://explorer.berylbit.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;