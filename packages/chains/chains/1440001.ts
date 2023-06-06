import type { Chain } from "../src/types";
export default {
  "name": "XRP Ledger EVM Devnet Sidechain",
  "chain": "XRPL",
  "shortName": "XRPL-EVM-Devnet-Sidechain",
  "chainId": 1440001,
  "testnet": true,
  "icon": {
    "format": "png",
    "url": "ipfs://bafkreidmgxjwjircegjkvysgz25b2ukw6h7axoirkxv6idupzzqsdrljgy",
    "width": 780,
    "height": 680
  },
  "rpc": [
    "https://xrp-ledger-evm-devnet-sidechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm-sidechain.xrpl.org"
  ],
  "nativeCurrency": {
    "decimals": 18,
    "name": "XRP",
    "symbol": "XRP"
  },
  "explorers": [
    {
      "url": "https://evm-sidechain.xrpl.org/",
      "name": "XRP Ledger Explorer",
      "standard": "EIP3091"
    }
  ],
  "slug": "xrp-ledger-evm-devnet-sidechain"
} as const satisfies Chain;