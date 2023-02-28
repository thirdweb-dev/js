export default {
  "name": "Dexalot Subnet",
  "chain": "DEXALOT",
  "icon": {
    "url": "ipfs://QmfVxdrWjtUKiGzqFDzAxHH2FqwP2aRuZTGcYWdWg519Xy",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://dexalot-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/dexalot/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "infoURL": "https://dexalot.com",
  "shortName": "dexalot",
  "chainId": 432204,
  "networkId": 432204,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "dexalot-subnet"
} as const;