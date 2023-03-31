import type { Chain } from "../src/types";
export default {
  "name": "Celo Mainnet",
  "chainId": 42220,
  "shortName": "celo",
  "chain": "CELO",
  "networkId": 42220,
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "rpc": [
    "https://celo.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://forno.celo.org",
    "wss://forno.celo.org/ws"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "infoURL": "https://docs.celo.org/",
  "explorers": [
    {
      "name": "Celoscan",
      "url": "https://celoscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://explorer.celo.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "celo"
} as const satisfies Chain;