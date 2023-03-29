export default {
  "name": "Dogcoin Testnet",
  "chain": "DOGS",
  "icon": {
    "url": "ipfs://QmZCadkExKThak3msvszZjo6UnAbUJKE61dAcg4TixuMC3",
    "width": 160,
    "height": 171,
    "format": "png"
  },
  "rpc": [
    "https://dogcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.dogcoin.me"
  ],
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
  "chainId": 9339,
  "networkId": 9339,
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://testnet.dogcoin.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dogcoin-testnet"
} as const;