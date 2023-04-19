import type { Chain } from "../src/types";
export default {
  "name": "Palette Chain Testnet",
  "chain": "PLT",
  "rpc": [
    "https://palette-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-opennet.com:22000"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "features": [],
  "infoURL": "https://hashpalette.com/",
  "shortName": "PCT",
  "chainId": 17180,
  "networkId": 17180,
  "icon": {
    "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://testnet.palettescan.com",
      "icon": {
        "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
        "width": 800,
        "height": 800,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "palette-chain-testnet"
} as const satisfies Chain;