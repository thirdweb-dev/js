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
  "infoURL": "https://www.bombmoney.com",
  "name": "BOMB Chain Testnet",
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "tBOMB",
    "decimals": 18
  },
  "networkId": 2399,
  "rpc": [
    "https://2399.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bombchain-testnet.ankr.com/bas_full_rpc_1"
  ],
  "shortName": "bombt",
  "slip44": 1,
  "slug": "bomb-chain-testnet",
  "testnet": true
} as const satisfies Chain;