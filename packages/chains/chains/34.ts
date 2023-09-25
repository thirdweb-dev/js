import type { Chain } from "../src/types";
export default {
  "name": "Dithereum Testnet",
  "chain": "DTH",
  "icon": "dithereum",
  "rpc": [
    "https://dithereum-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-testnet.dithereum.io"
  ],
  "faucets": [
    "https://faucet.dithereum.org"
  ],
  "nativeCurrency": {
    "name": "Dither",
    "symbol": "DTH",
    "decimals": 18
  },
  "infoURL": "https://dithereum.org",
  "shortName": "dth",
  "chainId": 34,
  "networkId": 34,
  "testnet": true,
  "slug": "dithereum-testnet"
} as const satisfies Chain;