import type { Chain } from "../src/types";
export default {
  "chain": "PixieChain",
  "chainId": 666,
  "explorers": [],
  "faucets": [
    "https://chain.pixie.xyz/faucet"
  ],
  "features": [],
  "infoURL": "https://scan-testnet.chain.pixie.xyz",
  "name": "Pixie Chain Testnet",
  "nativeCurrency": {
    "name": "Pixie Chain Testnet Native Token",
    "symbol": "PCTT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pixie-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.chain.pixie.xyz",
    "wss://ws-testnet.chain.pixie.xyz"
  ],
  "shortName": "pixie-chain-testnet",
  "slug": "pixie-chain-testnet",
  "testnet": true
} as const satisfies Chain;