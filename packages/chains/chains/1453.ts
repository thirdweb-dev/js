import type { Chain } from "../src/types";
export default {
  "chain": "MTC",
  "chainId": 1453,
  "explorers": [
    {
      "name": "MetaExplorer",
      "url": "https://istanbul-explorer.metachain.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://istanbul-faucet.metachain.dev"
  ],
  "icon": {
    "url": "ipfs://QmUH2Ph2hW4upvevEAGCaSo7nd8nthqMx5RrHcrnNZ9Y3g",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://metatime.com/en",
  "name": "MetaChain Istanbul",
  "nativeCurrency": {
    "name": "Metatime Coin",
    "symbol": "MTC",
    "decimals": 18
  },
  "networkId": 1453,
  "rpc": [
    "https://1453.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://istanbul-rpc.metachain.dev"
  ],
  "shortName": "metatimeistanbul",
  "slip44": 1453,
  "slug": "metachain-istanbul",
  "testnet": true,
  "title": "MetaChain Testnet Istanbul"
} as const satisfies Chain;