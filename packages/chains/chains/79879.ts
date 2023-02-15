export default {
  "name": "Gold Smart Chain Testnet",
  "chain": "STAND",
  "icon": {
    "url": "ipfs://QmPNuymyaKLJhCaXnyrsL8358FeTxabZFsaxMmWNU4Tzt3",
    "width": 396,
    "height": 418,
    "format": "png"
  },
  "rpc": [
    "https://gold-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.goldsmartchain.com"
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
  "shortName": "STANDt",
  "chainId": 79879,
  "networkId": 79879,
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://testnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "gold-smart-chain-testnet"
} as const;