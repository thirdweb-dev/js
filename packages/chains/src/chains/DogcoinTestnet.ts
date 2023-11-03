import type { Chain } from "../types";
export default {
  "chain": "DOGS",
  "chainId": 9339,
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://testnet.dogcoin.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.dogcoin.network"
  ],
  "icon": {
    "url": "ipfs://QmZCadkExKThak3msvszZjo6UnAbUJKE61dAcg4TixuMC3",
    "width": 160,
    "height": 171,
    "format": "png"
  },
  "infoURL": "https://dogcoin.network",
  "name": "Dogcoin Testnet",
  "nativeCurrency": {
    "name": "Dogcoin",
    "symbol": "DOGS",
    "decimals": 18
  },
  "networkId": 9339,
  "rpc": [
    "https://dogcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9339.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.dogcoin.me"
  ],
  "shortName": "DOGSt",
  "slug": "dogcoin-testnet",
  "testnet": true
} as const satisfies Chain;