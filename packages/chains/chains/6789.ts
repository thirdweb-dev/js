import type { Chain } from "../src/types";
export default {
  "chainId": 6789,
  "chain": "STAND",
  "name": "Gold Smart Chain Mainnet",
  "rpc": [
    "https://gold-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.goldsmartchain.com"
  ],
  "slug": "gold-smart-chain",
  "icon": {
    "url": "ipfs://QmPNuymyaKLJhCaXnyrsL8358FeTxabZFsaxMmWNU4Tzt3",
    "width": 396,
    "height": 418,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://mainnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;