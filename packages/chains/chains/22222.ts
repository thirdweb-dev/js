import type { Chain } from "../src/types";
export default {
  "chainId": 22222,
  "chain": "ETH",
  "name": "Nautilus Mainnet",
  "rpc": [
    "https://nautilus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.nautilus.nautchain.xyz"
  ],
  "slug": "nautilus",
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Zebec",
    "symbol": "ZBC",
    "decimals": 18
  },
  "infoURL": "https://docs.nautchain.xyz",
  "shortName": "NAUTCHAIN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://nautscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;