import type { Chain } from "../src/types";
export default {
  "chain": "PLT",
  "chainId": 1718,
  "explorers": [
    {
      "name": "Palettescan",
      "url": "https://palettescan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmPCEGZD1p1keTT2YfPp725azx1r9Ci41hejeUuGL2whFA",
        "width": 800,
        "height": 800,
        "format": "png"
      }
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
  "name": "Palette Chain Mainnet",
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "networkId": 1718,
  "rpc": [
    "https://palette-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1718.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-rpc.com:22000"
  ],
  "shortName": "PCM",
  "slug": "palette-chain",
  "testnet": false
} as const satisfies Chain;