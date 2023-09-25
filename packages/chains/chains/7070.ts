import type { Chain } from "../src/types";
export default {
  "chainId": 7070,
  "chain": "Planq",
  "name": "Planq Mainnet",
  "rpc": [
    "https://planq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.planq.network"
  ],
  "slug": "planq",
  "icon": {
    "url": "ipfs://QmWEy9xK5BoqxPuVs7T48WM4exJrxzkEFt45iHcxWqUy8D",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Planq",
    "symbol": "PLQ",
    "decimals": 18
  },
  "infoURL": "https://planq.network",
  "shortName": "planq",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;