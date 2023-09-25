import type { Chain } from "../src/types";
export default {
  "chainId": 135,
  "chain": "Alyx Chain Testnet",
  "name": "Alyx Chain Testnet",
  "rpc": [
    "https://alyx-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.alyxchain.com"
  ],
  "slug": "alyx-chain-testnet",
  "icon": {
    "url": "ipfs://bafkreifd43fcvh77mdcwjrpzpnlhthounc6b4u645kukqpqhduaveatf6i",
    "width": 2481,
    "height": 2481,
    "format": "png"
  },
  "faucets": [
    "https://faucet.alyxchain.com"
  ],
  "nativeCurrency": {
    "name": "Alyx Testnet Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "infoURL": "https://www.alyxchain.com",
  "shortName": "AlyxTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "alyx testnet scan",
      "url": "https://testnet.alyxscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;