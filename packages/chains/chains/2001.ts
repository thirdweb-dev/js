export default {
  "name": "Milkomeda C1 Mainnet",
  "chain": "milkAda",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "rpc": [
    "https://milkomeda-c1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-mainnet-cardano-evm.c1.milkomeda.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkAda",
    "symbol": "mADA",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkAda",
  "chainId": 2001,
  "networkId": 2001,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-mainnet-cardano-evm.c1.milkomeda.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "milkomeda-c1"
} as const;