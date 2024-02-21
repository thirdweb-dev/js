import type { Chain } from "../src/types";
export default {
  "chain": "MTC",
  "chainId": 571,
  "explorers": [
    {
      "name": "MetaExplorer",
      "url": "https://explorer.metatime.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmUH2Ph2hW4upvevEAGCaSo7nd8nthqMx5RrHcrnNZ9Y3g",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://metatime.com/en",
  "name": "MetaChain Mainnet",
  "nativeCurrency": {
    "name": "Metatime Coin",
    "symbol": "MTC",
    "decimals": 18
  },
  "networkId": 571,
  "rpc": [
    "https://571.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metatime.com"
  ],
  "shortName": "metatime",
  "slip44": 571,
  "slug": "metachain",
  "testnet": false
} as const satisfies Chain;