import type { Chain } from "../src/types";
export default {
  "chain": "Planq",
  "chainId": 7070,
  "explorers": [
    {
      "name": "Planq EVM Explorer (Blockscout)",
      "url": "https://evm.planq.network",
      "standard": "none"
    },
    {
      "name": "Planq Cosmos Explorer (BigDipper)",
      "url": "https://explorer.planq.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWEy9xK5BoqxPuVs7T48WM4exJrxzkEFt45iHcxWqUy8D",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://planq.network",
  "name": "Planq Mainnet",
  "nativeCurrency": {
    "name": "Planq",
    "symbol": "PLQ",
    "decimals": 18
  },
  "networkId": 7070,
  "rpc": [
    "https://7070.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.planq.network"
  ],
  "shortName": "planq",
  "slug": "planq",
  "testnet": false
} as const satisfies Chain;