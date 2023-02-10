export default {
  "name": "Milkomeda A1 Mainnet",
  "chain": "milkALGO",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "rpc": [
    "https://rpc-mainnet-algorand-rollup.a1.milkomeda.com",
    "wss://rpc-mainnet-algorand-rollup.a1.milkomeda.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkALGO",
    "symbol": "mALGO",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkALGO",
  "chainId": 2002,
  "networkId": 2002,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-algorand-rollup.a1.milkomeda.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "milkomeda-a1"
} as const;