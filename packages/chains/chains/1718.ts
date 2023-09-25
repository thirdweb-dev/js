import type { Chain } from "../src/types";
export default {
  "chainId": 1718,
  "chain": "PLT",
  "name": "Palette Chain Mainnet",
  "rpc": [
    "https://palette-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-rpc.com:22000"
  ],
  "slug": "palette-chain",
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
  "shortName": "PCM",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://palettescan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;