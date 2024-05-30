import type { Chain } from "../src/types";
export default {
  "chain": "One World Chain",
  "chainId": 309075,
  "explorers": [
    {
      "name": "One World Chain Mainnet Explorer",
      "url": "https://mainnet.oneworldchain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPmZ6vgtdMG7jttVZQUobF96Sva1noi5Fsi28V1Eck6eC",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://oneworldchain.org",
  "name": "One World Chain Mainnet",
  "nativeCurrency": {
    "name": "OWCT",
    "symbol": "OWCT",
    "decimals": 18
  },
  "networkId": 309075,
  "rpc": [
    "https://309075.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.oneworldchain.org"
  ],
  "shortName": "OWCTm",
  "slug": "one-world-chain",
  "testnet": false
} as const satisfies Chain;