export default {
  "name": "Planq Mainnet",
  "chain": "Planq",
  "icon": {
    "url": "ipfs://QmWEy9xK5BoqxPuVs7T48WM4exJrxzkEFt45iHcxWqUy8D",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://planq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.planq.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Planq",
    "symbol": "PLQ",
    "decimals": 18
  },
  "infoURL": "https://planq.network",
  "shortName": "planq",
  "chainId": 7070,
  "networkId": 7070,
  "explorers": [
    {
      "name": "Planq EVM Explorer (Blockscout)",
      "url": "https://evm.planq.network",
      "standard": "none"
    },
    {
      "name": "Planq Cosmos Explorer (BigDipper)",
      "url": "https://explorer.planq.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "planq"
} as const;