import type { Chain } from "../src/types";
export default {
  "chain": "PLT",
  "chainId": 17180,
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://testnet.palettescan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://hashpalette.com/",
  "name": "Palette Chain Testnet",
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://palette-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-opennet.com:22000"
  ],
  "shortName": "PCT",
  "slug": "palette-chain-testnet",
  "testnet": true
} as const satisfies Chain;