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
  "infoURL": "https://www.beryl-bit.com",
  "name": "BerylBit Mainnet",
  "nativeCurrency": {
    "name": "BerylBit Chain Native Token",
    "symbol": "BRB",
    "decimals": 18
  },
  "networkId": 9012,
  "rpc": [
    "https://9012.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.berylbit.io"
  ],
  "shortName": "brb",
  "slug": "berylbit",
  "testnet": false
} as const satisfies Chain;