import type { Chain } from "../src/types";
export default {
  "chainId": 202020,
  "chain": "tDSC",
  "name": "Decimal Smart Chain Testnet",
  "rpc": [
    "https://decimal-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-val.decimalchain.com/web3/"
  ],
  "slug": "decimal-smart-chain-testnet",
  "icon": {
    "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "tDEL",
    "decimals": 18
  },
  "infoURL": "https://decimalchain.com",
  "shortName": "tDSC",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "DSC Explorer Testnet",
      "url": "https://testnet.explorer.decimalchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;