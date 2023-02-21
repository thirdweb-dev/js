export default {
  "name": "Milkomeda C1 Testnet",
  "chain": "milkTAda",
  "icon": {
    "url": "ipfs://QmdoUtvHDybu5ppYBZT8BMRp6AqByVSoQs8nFwKbaS55jd",
    "width": 367,
    "height": 367,
    "format": "svg"
  },
  "rpc": [
    "https://milkomeda-c1-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-devnet-cardano-evm.c1.milkomeda.com",
    "wss://rpc-devnet-cardano-evm.c1.milkomeda.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "milkTAda",
    "symbol": "mTAda",
    "decimals": 18
  },
  "infoURL": "https://milkomeda.com",
  "shortName": "milkTAda",
  "chainId": 200101,
  "networkId": 200101,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer-devnet-cardano-evm.c1.milkomeda.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "milkomeda-c1-testnet"
} as const;