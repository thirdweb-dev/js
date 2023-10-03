import type { Chain } from "../src/types";
export default {
  "chain": "DOGS",
  "chainId": 1117,
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://explorer.dogcoin.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dogcoin.network"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmZCadkExKThak3msvszZjo6UnAbUJKE61dAcg4TixuMC3",
    "width": 160,
    "height": 171,
    "format": "png"
  },
  "infoURL": "https://dogcoin.network",
  "name": "Dogcoin Mainnet",
  "nativeCurrency": {
    "name": "Dogcoin",
    "symbol": "DOGS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dogcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.dogcoin.me"
  ],
  "shortName": "DOGSm",
  "slug": "dogcoin",
  "testnet": false
} as const satisfies Chain;