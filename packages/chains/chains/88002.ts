import type { Chain } from "../src/types";
export default {
  "name": "Nautilus Proteus Testnet",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://nautilus-proteus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.proteus.nautchain.xyz/solana"
  ],
  "faucets": [
    "https://proteusfaucet.nautchain.xyz"
  ],
  "nativeCurrency": {
    "name": "Zebec Test Token",
    "symbol": "tZBC",
    "decimals": 18
  },
  "infoURL": "https://docs.nautchain.xyz",
  "shortName": "NAUTTest",
  "chainId": 88002,
  "networkId": 88002,
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
  "testnet": true,
  "slug": "nautilus-proteus-testnet"
} as const satisfies Chain;