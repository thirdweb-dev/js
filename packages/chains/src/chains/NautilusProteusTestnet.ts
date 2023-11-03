import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 88002,
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://proteus.nautscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://proteusfaucet.nautchain.xyz"
  ],
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://docs.nautchain.xyz",
  "name": "Nautilus Proteus Testnet",
  "nativeCurrency": {
    "name": "Zebec Test Token",
    "symbol": "tZBC",
    "decimals": 18
  },
  "networkId": 88002,
  "rpc": [
    "https://nautilus-proteus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://88002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.proteus.nautchain.xyz/solana"
  ],
  "shortName": "NAUTTest",
  "slug": "nautilus-proteus-testnet",
  "testnet": true
} as const satisfies Chain;