import type { Chain } from "../src/types";
export default {
  "chain": "STAND",
  "chainId": 79879,
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://testnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.goldsmartchain.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmPNuymyaKLJhCaXnyrsL8358FeTxabZFsaxMmWNU4Tzt3",
    "width": 396,
    "height": 418,
    "format": "png"
  },
  "infoURL": "https://goldsmartchain.com",
  "name": "Gold Smart Chain Testnet",
  "nativeCurrency": {
    "name": "Standard in Gold",
    "symbol": "STAND",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gold-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.goldsmartchain.com"
  ],
  "shortName": "STANDt",
  "slug": "gold-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;