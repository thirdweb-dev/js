import type { Chain } from "../src/types";
export default {
  "chain": "BOMB",
  "chainId": 2399,
  "explorers": [
    {
      "name": "bombscan-testnet",
      "url": "https://explorer.bombchain-testnet.ankr.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bombchain-testnet.ankr.com/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://Qmc44uSjfdNHdcxPTgZAL8eZ8TLe4UmSHibcvKQFyGJxTB",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://www.bombmoney.com",
  "name": "BOMB Chain Testnet",
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "BOMB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bomb-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bombchain-testnet.ankr.com/bas_full_rpc_1"
  ],
  "shortName": "bombt",
  "slug": "bomb-chain-testnet",
  "testnet": true
} as const satisfies Chain;