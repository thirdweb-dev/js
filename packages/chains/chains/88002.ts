import type { Chain } from "../src/types";
export default {
  "chainId": 88002,
  "chain": "ETH",
  "name": "Nautilus Proteus Testnet",
  "rpc": [
    "https://nautilus-proteus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.proteus.nautchain.xyz/solana"
  ],
  "slug": "nautilus-proteus-testnet",
  "icon": {
    "url": "ipfs://QmNutSgM7n6aJPPDiofe9Dm1epy1RcYTMvugukLUK2vmPM",
    "width": 500,
    "height": 500,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://proteus.nautscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;