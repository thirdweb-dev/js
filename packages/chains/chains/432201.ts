export default {
  "name": "Dexalot Subnet Testnet",
  "chain": "DEXALOT",
  "icon": {
    "url": "ipfs://QmfVxdrWjtUKiGzqFDzAxHH2FqwP2aRuZTGcYWdWg519Xy",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://subnets.avax.network/dexalot/testnet/rpc"
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=dexalot"
  ],
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "infoURL": "https://dexalot.com",
  "shortName": "dexalot-testnet",
  "chainId": 432201,
  "networkId": 432201,
  "explorers": [
    {
      "name": "Avalanche Subnet Testnet Explorer",
      "url": "https://subnets-test.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dexalot-subnet-testnet"
} as const;