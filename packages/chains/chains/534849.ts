import type { Chain } from "../src/types";
export default {
  "name": "Shinarium Beta",
  "chain": "Shinarium",
  "rpc": [
    "https://shinarium-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shinarium.org"
  ],
  "faucets": [
    "https://faucet.shinarium.org"
  ],
  "nativeCurrency": {
    "name": "Shina Inu",
    "symbol": "SHI",
    "decimals": 18
  },
  "infoURL": "https://shinarium.org",
  "shortName": "shi",
  "chainId": 534849,
  "networkId": 534849,
  "explorers": [
    {
      "name": "shinascan",
      "url": "https://shinascan.shinarium.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "shinarium-beta"
} as const satisfies Chain;