import type { Chain } from "../src/types";
export default {
  "name": "JuncaGlobal Chain Testnet",
  "chain": "JuncaGlobal Test Chain",
  "rpc": [
    "https://juncaglobal-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.juncachain.com",
    "wss://ws-testnet.juncachain.com"
  ],
  "faucets": [
    "https://faucet-testnet.juncachain.com"
  ],
  "nativeCurrency": {
    "name": "JuncaGlobal Chain Testnet Native Token",
    "symbol": "JGCT",
    "decimals": 18
  },
  "infoURL": "https://junca-cash.world",
  "shortName": "junca",
  "chainId": 669,
  "networkId": 669,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan-testnet.juncachain.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "juncaglobal-chain-testnet"
} as const satisfies Chain;