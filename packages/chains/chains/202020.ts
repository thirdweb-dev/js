import type { Chain } from "../src/types";
export default {
  "chain": "tDSC",
  "chainId": 202020,
  "explorers": [
    {
      "name": "DSC Explorer Testnet",
      "url": "https://testnet.explorer.decimalchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSgzwKnJJjys3Uq2aVVdwJ3NffLj3CXMVCph9uByTBegc",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://decimalchain.com",
  "name": "Decimal Smart Chain Testnet",
  "nativeCurrency": {
    "name": "Decimal",
    "symbol": "tDEL",
    "decimals": 18
  },
  "networkId": 202020,
  "rpc": [
    "https://decimal-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://202020.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-val.decimalchain.com/web3/"
  ],
  "shortName": "tDSC",
  "slug": "decimal-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;