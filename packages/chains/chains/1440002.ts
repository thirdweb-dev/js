import type { Chain } from "../src/types";
export default {
  "chain": "XRPL",
  "chainId": 1440002,
  "explorers": [
    {
      "name": "XRP Ledger Explorer",
      "url": "https://evm-sidechain.xrpl.org/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreidmgxjwjircegjkvysgz25b2ukw6h7axoirkxv6idupzzqsdrljgy",
    "width": 780,
    "height": 680,
    "format": "png"
  },
  "name": "XRP Ledger EVM Devnet Sidechain",
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "networkId": 1440002,
  "redFlags": [],
  "rpc": [
    "https://xrp-ledger-evm-devnet-sidechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1440002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm-sidechain.xrpl.org"
  ],
  "shortName": "XRPL-EVM-Devnet-Sidechain",
  "slug": "xrp-ledger-evm-devnet-sidechain",
  "testnet": true
} as const satisfies Chain;