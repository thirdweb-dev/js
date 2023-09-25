import type { Chain } from "../src/types";
export default {
  "chainId": 1117,
  "chain": "DOGS",
  "name": "Dogcoin Mainnet",
  "rpc": [
    "https://dogcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.dogcoin.me"
  ],
  "slug": "dogcoin",
  "icon": {
    "url": "ipfs://QmZCadkExKThak3msvszZjo6UnAbUJKE61dAcg4TixuMC3",
    "width": 160,
    "height": 171,
    "format": "png"
  },
  "faucets": [
    "https://faucet.dogcoin.network"
  ],
  "nativeCurrency": {
    "name": "Dogcoin",
    "symbol": "DOGS",
    "decimals": 18
  },
  "infoURL": "https://dogcoin.network",
  "shortName": "DOGSm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://explorer.dogcoin.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;