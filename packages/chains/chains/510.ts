import type { Chain } from "../src/types";
export default {
  "chain": "Syndicate",
  "chainId": 510,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeSvQcD3XvLFAiMLoQSPbGK9JxVfbCWPBUTMLhhhzYPqX",
    "width": 16000,
    "height": 16000,
    "format": "png"
  },
  "infoURL": "https://syndicate.io",
  "name": "Syndicate Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 510,
  "rpc": [
    "https://syndicate-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://510.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.syndicate.io"
  ],
  "shortName": "syndicate-chain-mainnet",
  "slug": "syndicate-chain",
  "status": "incubating",
  "testnet": false,
  "title": "Syndicate Chain"
} as const satisfies Chain;