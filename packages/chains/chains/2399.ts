import type { Chain } from "../src/types";
export default {
  "chainId": 2399,
  "chain": "BOMB",
  "name": "BOMB Chain Testnet",
  "rpc": [
    "https://bomb-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bombchain-testnet.ankr.com/bas_full_rpc_1"
  ],
  "slug": "bomb-chain-testnet",
  "icon": {
    "url": "ipfs://Qmc44uSjfdNHdcxPTgZAL8eZ8TLe4UmSHibcvKQFyGJxTB",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [
    "https://faucet.bombchain-testnet.ankr.com/"
  ],
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "BOMB",
    "decimals": 18
  },
  "infoURL": "https://www.bombmoney.com",
  "shortName": "bombt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "bombscan-testnet",
      "url": "https://explorer.bombchain-testnet.ankr.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;