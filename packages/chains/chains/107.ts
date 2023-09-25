import type { Chain } from "../src/types";
export default {
  "chainId": 107,
  "chain": "NTN",
  "name": "Nebula Testnet",
  "rpc": [
    "https://nebula-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.novanetwork.io"
  ],
  "slug": "nebula-testnet",
  "icon": {
    "url": "ipfs://QmeFaJtQqTKKuXQR7ysS53bLFPasFBcZw445cvYJ2HGeTo",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.novanetwork.io"
  ],
  "nativeCurrency": {
    "name": "Nebula X",
    "symbol": "NBX",
    "decimals": 18
  },
  "infoURL": "https://novanetwork.io",
  "shortName": "ntn",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "nebulatestnet",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;