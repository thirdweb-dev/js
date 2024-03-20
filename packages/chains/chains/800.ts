import type { Chain } from "../src/types";
export default {
  "chain": "Lucid",
  "chainId": 800,
  "explorers": [
    {
      "name": "Lucid Explorer",
      "url": "https://explorer.lucidcoin.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.lucidcoin.io"
  ],
  "icon": {
    "url": "ipfs://bafybeigxiyyxll4vst5cjjh732mr6zhsnligxubaldyiul2xdvvi6ibktu",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://lucidcoin.io",
  "name": "Lucid Blockchain",
  "nativeCurrency": {
    "name": "LUCID",
    "symbol": "LUCID",
    "decimals": 18
  },
  "networkId": 800,
  "rpc": [
    "https://800.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lucidcoin.io"
  ],
  "shortName": "LUCID",
  "slug": "lucid-blockchain",
  "testnet": false
} as const satisfies Chain;