import type { Chain } from "../src/types";
export default {
  "chainId": 800,
  "chain": "Lucid",
  "name": "Lucid Blockchain",
  "rpc": [
    "https://lucid-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lucidcoin.io"
  ],
  "slug": "lucid-blockchain",
  "icon": {
    "url": "ipfs://bafybeigxiyyxll4vst5cjjh732mr6zhsnligxubaldyiul2xdvvi6ibktu",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [
    "https://faucet.lucidcoin.io"
  ],
  "nativeCurrency": {
    "name": "LUCID",
    "symbol": "LUCID",
    "decimals": 18
  },
  "infoURL": "https://lucidcoin.io",
  "shortName": "LUCID",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Lucid Explorer",
      "url": "https://explorer.lucidcoin.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;