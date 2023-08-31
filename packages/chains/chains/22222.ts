import type { Chain } from "../src/types";
export default {
  "name": "Nautilus Mainnet",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://nautilus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.nautilus.nautchain.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zebec",
    "symbol": "ZBC",
    "decimals": 18
  },
  "infoURL": "https://docs.nautchain.xyz",
  "shortName": "NAUTCHAIN",
  "chainId": 22222,
  "networkId": 22222,
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
  "testnet": false,
  "slug": "nautilus"
} as const satisfies Chain;