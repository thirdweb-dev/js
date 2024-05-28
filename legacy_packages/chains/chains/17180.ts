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
  "infoURL": "https://hashpalette.com/",
  "name": "Palette Chain Testnet",
  "nativeCurrency": {
    "name": "Palette Token",
    "symbol": "PLT",
    "decimals": 18
  },
  "networkId": 17180,
  "rpc": [
    "https://17180.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://palette-opennet.com:22000"
  ],
  "shortName": "PCT",
  "slip44": 1,
  "slug": "palette-chain-testnet",
  "testnet": true
} as const satisfies Chain;