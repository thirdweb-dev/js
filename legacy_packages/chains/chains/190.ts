import type { Chain } from "../src/types";
export default {
  "chain": "Underchain 1",
  "chainId": 190,
  "explorers": [
    {
      "name": "bbqchain-explorer",
      "url": "https://bbqchain-exp.commudao.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://commudao.xyz",
  "name": "CMDAO BBQ Chain",
  "nativeCurrency": {
    "name": "CommuDAO",
    "symbol": "CMD",
    "decimals": 18
  },
  "networkId": 190,
  "rpc": [
    "https://190.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bbqchain-rpc.commudao.xyz"
  ],
  "shortName": "cmdao-bbq-chain",
  "slug": "cmdao-bbq-chain",
  "testnet": false
} as const satisfies Chain;