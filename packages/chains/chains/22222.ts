import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 22222,
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://nautscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://docs.nautchain.xyz",
  "name": "Nautilus Mainnet",
  "nativeCurrency": {
    "name": "Zebec",
    "symbol": "ZBC",
    "decimals": 18
  },
  "networkId": 22222,
  "rpc": [
    "https://nautilus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://22222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.nautilus.nautchain.xyz"
  ],
  "shortName": "NAUTCHAIN",
  "slug": "nautilus",
  "testnet": false
} as const satisfies Chain;