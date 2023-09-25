import type { Chain } from "../src/types";
export default {
  "chainId": 9339,
  "chain": "DOGS",
  "name": "Dogcoin Testnet",
  "rpc": [
    "https://dogcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.dogcoin.me"
  ],
  "slug": "dogcoin-testnet",
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
  "shortName": "DOGSt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://testnet.dogcoin.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;