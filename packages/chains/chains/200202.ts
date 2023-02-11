export default {
  "name": "Milkomeda A1 Testnet",
  "chain": "milkTAlgo",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "rpc": [
    "https://milkomeda-a1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-algorand-rollup.a1.milkomeda.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkTAlgo",
    "symbol": "mTAlgo",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkTAlgo",
  "chainId": 200202,
  "networkId": 200202,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "milkomeda-a1-testnet"
} as const;