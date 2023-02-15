export default {
  "name": "Gold Smart Chain Mainnet",
  "chain": "STAND",
  "icon": {
    "url": "ipfs://QmPNuymyaKLJhCaXnyrsL8358FeTxabZFsaxMmWNU4Tzt3",
    "width": 396,
    "height": 418,
    "format": "png"
  },
  "rpc": [
    "https://gold-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.goldsmartchain.com"
  ],
  "faucets": [
    "https://faucet.goldsmartchain.com"
  ],
  "nativeCurrency": {
    "name": "Standard in Gold",
    "symbol": "STAND",
    "decimals": 18
  },
  "infoURL": "https://goldsmartchain.com",
  "shortName": "STANDm",
  "chainId": 6789,
  "networkId": 6789,
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://mainnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "gold-smart-chain"
} as const;