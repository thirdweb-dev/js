import type { Chain } from "../types";
export default {
  "chain": "STAND",
  "chainId": 6789,
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://mainnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.goldsmartchain.com"
  ],
  "icon": {
    "url": "ipfs://QmPNuymyaKLJhCaXnyrsL8358FeTxabZFsaxMmWNU4Tzt3",
    "width": 396,
    "height": 418,
    "format": "png"
  },
  "infoURL": "https://goldsmartchain.com",
  "name": "Gold Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Standard in Gold",
    "symbol": "STAND",
    "decimals": 18
  },
  "networkId": 6789,
  "rpc": [
    "https://gold-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.goldsmartchain.com"
  ],
  "shortName": "STANDm",
  "slug": "gold-smart-chain",
  "testnet": false
} as const satisfies Chain;