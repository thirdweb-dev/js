import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 88002,
  "explorers": [
    {
      "name": "Nautscan",
      "url": "https://proteus.nautscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://proteusfaucet.nautchain.xyz"
  ],
  "infoURL": "https://docs.nautchain.xyz",
  "name": "Nautilus Proteus Testnet",
  "nativeCurrency": {
    "name": "Zebec Test Token",
    "symbol": "tZBC",
    "decimals": 18
  },
  "networkId": 88002,
  "rpc": [
    "https://88002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.proteus.nautchain.xyz/solana"
  ],
  "shortName": "NAUTTest",
  "slip44": 1,
  "slug": "nautilus-proteus-testnet",
  "testnet": true
} as const satisfies Chain;