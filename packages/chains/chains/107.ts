import type { Chain } from "../src/types";
export default {
  "chain": "NTN",
  "chainId": 107,
  "explorers": [
    {
      "name": "nebulatestnet",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.novanetwork.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmeFaJtQqTKKuXQR7ysS53bLFPasFBcZw445cvYJ2HGeTo",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://novanetwork.io",
  "name": "Nebula Testnet",
  "nativeCurrency": {
    "name": "Nebula X",
    "symbol": "NBX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nebula-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.novanetwork.io"
  ],
  "shortName": "ntn",
  "slug": "nebula-testnet",
  "testnet": true
} as const satisfies Chain;