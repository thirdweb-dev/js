import type { Chain } from "../src/types";
export default {
  "chain": "Syndicate Frame",
  "chainId": 5101,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeSvQcD3XvLFAiMLoQSPbGK9JxVfbCWPBUTMLhhhzYPqX",
    "width": 16000,
    "height": 16000,
    "format": "png"
  },
  "infoURL": "https://syndicate.io",
  "name": "Syndicate Frame Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5101,
  "rpc": [
    "https://syndicate-frame-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5101.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-frame.syndicate.io"
  ],
  "shortName": "syndicate-chain-frame",
  "slug": "syndicate-frame-chain",
  "status": "incubating",
  "testnet": false,
  "title": "Syndicate Frame Chain"
} as const satisfies Chain;