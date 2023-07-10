import type { Chain } from "../src/types";
export default {
  "name": "Palette Chain Mainnet",
  "chain": "PLT",
  "rpc": [
    "https://palette-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-rpc.com:22000"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "features": [],
  "infoURL": "https://hashpalette.com/",
  "shortName": "PCM",
  "chainId": 1718,
  "networkId": 1718,
  "icon": {
    "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://palettescan.com",
      "icon": {
        "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
        "width": 800,
        "height": 800,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "palette-chain"
} as const satisfies Chain;