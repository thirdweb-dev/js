import type { Chain } from "../src/types";
export default {
  "chainId": 1440001,
  "chain": "XRPL",
  "name": "XRP Ledger EVM Devnet Sidechain",
  "rpc": [
    "https://xrp-ledger-evm-devnet-sidechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm-sidechain.xrpl.org"
  ],
  "slug": "xrp-ledger-evm-devnet-sidechain",
  "icon": {
    "url": "ipfs://bafkreidmgxjwjircegjkvysgz25b2ukw6h7axoirkxv6idupzzqsdrljgy",
    "width": 780,
    "height": 680,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "shortName": "XRPL-EVM-Devnet-Sidechain",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "XRP Ledger Explorer",
      "url": "https://evm-sidechain.xrpl.org/",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;