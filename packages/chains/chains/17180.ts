import type { Chain } from "../src/types";
export default {
  "chainId": 17180,
  "chain": "PLT",
  "name": "Palette Chain Testnet",
  "rpc": [
    "https://palette-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-opennet.com:22000"
  ],
  "slug": "palette-chain-testnet",
  "icon": {
    "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "infoURL": "https://hashpalette.com/",
  "shortName": "PCT",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://testnet.palettescan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;