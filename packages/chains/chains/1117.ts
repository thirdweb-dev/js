export default {
  "name": "Dogcoin Mainnet",
  "chain": "DOGS",
  "icon": {
    "url": "ipfs://QmZCadkExKThak3msvszZjo6UnAbUJKE61dAcg4TixuMC3",
    "width": 160,
    "height": 171,
    "format": "png"
  },
  "rpc": [
    "https://dogcoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.dogcoin.network"
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
  "shortName": "DOGSm",
  "chainId": 1117,
  "networkId": 1117,
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://explorer.dogcoin.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dogcoin"
} as const;